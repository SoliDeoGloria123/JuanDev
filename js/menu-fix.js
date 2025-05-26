// Script mejorado para arreglar el menú de inicio
document.addEventListener('DOMContentLoaded', function() {
    console.log("Iniciando script para corregir el menú de inicio");
    
    // Asegurarnos de que este script se ejecute después de main.js
    setTimeout(fixStartMenu, 1500);
    
    function fixStartMenu() {
        // Referencias a los elementos relevantes
        const startMenu = document.getElementById('start-menu');
        const startButton = document.getElementById('start-button');
        
        if (!startMenu || !startButton) {
            console.error("No se encontraron los elementos necesarios para el menú de inicio");
            return;
        }
        
        console.log("Aplicando correcciones al menú de inicio");
        
        // 1. Eliminar cualquier !important que haya quedado
        startMenu.style.cssText = "display: none;";
        
        // 2. Crear estructura flex para los paneles
        const contentContainer = document.createElement('div');
        contentContainer.style.display = 'flex';
        contentContainer.style.height = 'calc(100% - 75px)';
        contentContainer.style.width = '100%';
        
        // 3. Extraer contenido actual
        const header = startMenu.querySelector('.start-menu-header');
        const leftPanel = startMenu.querySelector('.start-menu-left');
        const rightPanel = startMenu.querySelector('.start-menu-right');
        
        if (!header || !leftPanel || !rightPanel) {
            console.error("Estructura del menú incompleta");
            return;
        }
        
        // 4. Aplicar estilos sin cambiar la visibilidad
        Object.assign(startMenu.style, {
            position: 'absolute',
            bottom: '40px',
            left: '0',
            width: '380px',
            height: '480px',
            backgroundColor: '#ffffff',
            border: '2px solid rgba(0, 0, 0, 0.3)',
            borderTopRightRadius: '8px',
            boxShadow: '2px -2px 12px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            padding: '0',
            margin: '0',
            zIndex: '9999',
            flexDirection: 'column'
        });
        
        // 5. Estilos para encabezado y paneles
        Object.assign(header.style, {
            height: '75px',
            padding: '0 15px',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(to right, #215dc6 0%, #1e56b8 60%, #1964e5 100%)',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            borderBottom: '1px solid #104bac',
            width: '100%'
        });
        
        Object.assign(leftPanel.style, {
            flex: '60%',
            padding: '8px',
            backgroundColor: 'white',
            overflow: 'auto',
            height: '100%'
        });
        
        Object.assign(rightPanel.style, {
            flex: '40%',
            padding: '8px',
            backgroundColor: '#d3e5fa',
            borderLeft: '1px solid #a8c8e4',
            overflow: 'auto',
            height: '100%'
        });
        
        // 6. Reconstruir estructura del menú
        // Hacer copia de los elementos para preservarlos
        const headerClone = header.cloneNode(true);
        const leftClone = leftPanel.cloneNode(true);
        const rightClone = rightPanel.cloneNode(true);
        
        // Limpiar el menú
        startMenu.innerHTML = '';
        
        // Reconstruir con estructura correcta
        startMenu.appendChild(headerClone);
        contentContainer.appendChild(leftClone);
        contentContainer.appendChild(rightClone);
        startMenu.appendChild(contentContainer);
        
        console.log("Estructura del menú reconstruida");
        
        // 7. Arreglar estilos de elementos del menú
        const menuItems = startMenu.querySelectorAll('.start-menu-item, .start-menu-right-item');
        menuItems.forEach(item => {
            Object.assign(item.style, {
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '3px',
                marginBottom: '4px',
                cursor: 'pointer',
                backgroundColor: 'transparent'
            });
            
            // Efectos de hover
            item.addEventListener('mouseenter', function() {
                this.style.backgroundColor = 'rgba(49, 106, 197, 0.2)';
            });
            
            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
            });
        });
        
        // 8. CRÍTICO: Restaurar el comportamiento del toggle desde main.js
        // Variable para rastrear el estado del menú
        let isStartMenuOpen = false;
        
        // Eliminar eventos existentes y volver a registrar
        const newStartButton = startButton.cloneNode(true);
        startButton.parentNode.replaceChild(newStartButton, startButton);
        
        newStartButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log("Botón de inicio clickeado");
            
            // Toggle simple y directo
            if (isStartMenuOpen) {
                console.log("Cerrando menú");
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            } else {
                console.log("Abriendo menú");
                startMenu.style.display = 'flex'; // ¡Usamos flex porque reconstruimos el menú con flexbox!
                isStartMenuOpen = true;
            }
        });
        
        // 9. Reinstalar los eventos para los elementos del menú
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.stopPropagation();
                
                // Procesar ventanas
                const windowId = this.getAttribute('data-window');
                if (windowId) {
                    const targetWindow = document.getElementById(windowId);
                    if (targetWindow) {
                        targetWindow.style.display = 'block';
                        targetWindow.style.zIndex = 9999;
                        
                        // Activar ventana
                        document.querySelectorAll('.window.active').forEach(w => {
                            w.classList.remove('active');
                        });
                        targetWindow.classList.add('active');
                    }
                } else if (this.id === 'shutdown') {
                    // Manejar apagado
                    if (confirm('¿Estás seguro de que quieres cerrar esta página?')) {
                        document.getElementById('boot-screen').style.display = 'flex';
                        document.getElementById('desktop').classList.add('hidden');
                        document.getElementById('taskbar').classList.add('hidden');
                        
                        setTimeout(() => {
                            document.body.innerHTML = `
                                <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: black; color: white; font-family: 'Courier New', monospace;">
                                    <div style="text-align: center;">
                                        <div style="font-size: 24px; margin-bottom: 20px;">Es seguro apagar el equipo.</div>
                                        <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer;">Reiniciar</button>
                                    </div>
                                </div>
                            `;
                        }, 2000);
                    }
                }
                
                // Cerrar el menú
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            });
        });
        
        // 10. Cerrar el menú al hacer clic fuera de él
        document.addEventListener('click', function(e) {
            if (isStartMenuOpen && 
                !startMenu.contains(e.target) && 
                e.target !== newStartButton) {
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            }
        });
        
        console.log("Eventos del menú reinstalados correctamente");
    }
});