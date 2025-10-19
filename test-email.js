#!/usr/bin/env node

// Test script para validar la configuración de EmailJS
// Este script verifica si todas las credenciales están correctamente configuradas

const https = require('https');
const fs = require('fs');

// Función para leer el archivo de configuración
function loadEmailJSConfig() {
    try {
        const configContent = fs.readFileSync('./js/emailjs-config.js', 'utf8');
        
        // Extraer las configuraciones usando regex
        const publicKeyMatch = configContent.match(/PUBLIC_KEY:\s*["']([^"']+)["']/);
        const serviceIdMatch = configContent.match(/SERVICE_ID:\s*["']([^"']+)["']/);
        const templateIdMatch = configContent.match(/TEMPLATE_ID:\s*["']([^"']+)["']/);
        const toEmailMatch = configContent.match(/TO_EMAIL:\s*["']([^"']+)["']/);
        
        return {
            publicKey: publicKeyMatch ? publicKeyMatch[1] : null,
            serviceId: serviceIdMatch ? serviceIdMatch[1] : null,
            templateId: templateIdMatch ? templateIdMatch[1] : null,
            toEmail: toEmailMatch ? toEmailMatch[1] : null
        };
    } catch (error) {
        console.error('❌ Error leyendo archivo de configuración:', error.message);
        return null;
    }
}

// Función para verificar la configuración
function validateConfig(config) {
    console.log('\n🔧 VERIFICACIÓN DE CONFIGURACIÓN EMAILJS\n' + '='.repeat(50));
    
    const checks = [
        { name: 'Public Key', value: config.publicKey, placeholder: 'TU_PUBLIC_KEY_AQUI' },
        { name: 'Service ID', value: config.serviceId, placeholder: 'TU_SERVICE_ID_AQUI' },
        { name: 'Template ID', value: config.templateId, placeholder: 'TU_TEMPLATE_ID_AQUI' },
        { name: 'Email destino', value: config.toEmail, placeholder: 'juan.juand.dev@gmail.com' }
    ];
    
    let allValid = true;
    
    checks.forEach(check => {
        if (!check.value || check.value === check.placeholder) {
            console.log(`❌ ${check.name}: NO CONFIGURADO`);
            allValid = false;
        } else {
            console.log(`✅ ${check.name}: ${check.value}`);
        }
    });
    
    return allValid;
}

// Función para probar conectividad con EmailJS
function testEmailJSConnection(config) {
    return new Promise((resolve, reject) => {
        console.log('\n📡 PROBANDO CONECTIVIDAD CON EMAILJS\n' + '='.repeat(50));
        
        const testData = JSON.stringify({
            service_id: config.serviceId,
            template_id: config.templateId,
            user_id: config.publicKey,
            template_params: {
                from_name: 'Test Script',
                from_email: 'test@example.com',
                company: 'Automated Testing',
                subject: 'Prueba técnica automatizada',
                message: 'Este es un mensaje de prueba enviado desde el script de validación para verificar que EmailJS está funcionando correctamente.',
                to_name: 'Juan David Mahecha Sabogal',
                to_email: config.toEmail
            }
        });
        
        const options = {
            hostname: 'api.emailjs.com',
            port: 443,
            path: '/api/v1.0/email/send',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(testData)
            }
        };
        
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`📊 Código de respuesta: ${res.statusCode}`);
                console.log(`📋 Headers:`, res.headers);
                
                if (res.statusCode === 200) {
                    console.log('✅ CONEXIÓN EXITOSA - Email enviado correctamente');
                    console.log('📧 Revisa tu bandeja de entrada:', config.toEmail);
                    resolve(true);
                } else {
                    console.log('❌ ERROR EN ENVÍO');
                    console.log('📄 Respuesta:', data);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (error) => {
            console.log('❌ ERROR DE CONEXIÓN:', error.message);
            reject(error);
        });
        
        console.log('📤 Enviando solicitud de prueba...');
        req.write(testData);
        req.end();
    });
}

// Función principal
async function main() {
    console.log('🚀 INICIANDO PRUEBAS DE EMAILJS PORTFOLIO\n');
    
    // Cargar configuración
    const config = loadEmailJSConfig();
    if (!config) {
        console.log('❌ No se pudo cargar la configuración');
        process.exit(1);
    }
    
    // Validar configuración
    const isConfigValid = validateConfig(config);
    if (!isConfigValid) {
        console.log('\n❌ CONFIGURACIÓN INCOMPLETA');
        console.log('💡 Completa todas las credenciales en js/emailjs-config.js');
        process.exit(1);
    }
    
    try {
        // Probar conexión
        const success = await testEmailJSConnection(config);
        
        console.log('\n' + '='.repeat(50));
        if (success) {
            console.log('🎉 ¡TODAS LAS PRUEBAS EXITOSAS!');
            console.log('✅ EmailJS está configurado correctamente');
            console.log('✅ El formulario de contacto debería funcionar');
            console.log('📧 Email de prueba enviado exitosamente');
        } else {
            console.log('⚠️  CONFIGURACIÓN VÁLIDA PERO HAY PROBLEMAS');
            console.log('🔍 Revisa las credenciales en EmailJS dashboard');
        }
    } catch (error) {
        console.log('\n❌ ERROR EN LAS PRUEBAS');
        console.log('🔍 Detalles:', error.message);
    }
    
    console.log('\n🔗 Para más información:');
    console.log('   • EmailJS Dashboard: https://dashboard.emailjs.com');
    console.log('   • Documentación: https://www.emailjs.com/docs/');
}

// Ejecutar el script
main();