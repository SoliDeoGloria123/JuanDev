// ===== CONFIGURACIÓN DE EMAILJS =====
// 
// INSTRUCCIONES PARA CONFIGURAR:
// 1. Ve a https://emailjs.com y crea una cuenta
// 2. Configura un servicio de email (Gmail, Outlook, etc.)
// 3. Crea un template de email
// 4. Reemplaza los valores a continuación con los tuyos
//

const EMAILJS_CONFIG = {
    // Tu Public Key de EmailJS (Account > API Keys)
    PUBLIC_KEY: "czyK7mQ9hiDQhR0I",
    
    // Tu Service ID (Email Services > tu servicio)
    SERVICE_ID: "service_7y78bph", 
    
    // Tu Template ID (Email Templates > tu template)
    TEMPLATE_ID: "plantilla_8nnob5g",
    
    // Email de destino (donde quieres recibir los mensajes)
    TO_EMAIL: "juan.juand.dev@gmail.com"
};

// Función para verificar si EmailJS está configurado
function isEmailJSConfigured() {
    return EMAILJS_CONFIG.PUBLIC_KEY !== "TU_PUBLIC_KEY_AQUI" &&
           EMAILJS_CONFIG.SERVICE_ID !== "TU_SERVICE_ID_AQUI" &&
           EMAILJS_CONFIG.TEMPLATE_ID !== "TU_TEMPLATE_ID_AQUI";
}

// Hacer disponible globalmente
window.EMAILJS_CONFIG = EMAILJS_CONFIG;
window.isEmailJSConfigured = isEmailJSConfigured;