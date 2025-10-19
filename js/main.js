document.addEventListener('DOMContentLoaded', function() {
    // Referencias a elementos
    const bootScreen = document.getElementById('boot-screen');
    const desktop = document.getElementById('desktop');
    const taskbar = document.getElementById('taskbar');
    const windows = document.querySelectorAll('.window');
    const icons = document.querySelectorAll('.icon');
    const startButton = document.getElementById('start-button');
    const startMenu = document.getElementById('start-menu');
    
    // Sistema de ventanas
    let activeWindow = null;
    let zIndexCounter = 100;
    let isStartMenuOpen = false;
    
    // Simulación de inicio de Windows XP
    setTimeout(function() {
        bootScreen.style.display = 'none';
        desktop.classList.remove('hidden');
        taskbar.classList.remove('hidden');
    }, 5000); // 5 segundos para la pantalla de carga
    
    
    // Actualizar el reloj de sistema
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        document.getElementById('system-time').textContent = `${hours}:${minutes}`;
    }
    
    setInterval(updateClock, 60000);
    updateClock();
    
    // Inicializar el arrastre de ventanas
    windows.forEach(window => {
        const header = window.querySelector('.window-header');
        let offsetX, offsetY;
        let isDragging = false;
        
        // Evento para activar una ventana al hacer clic
        window.addEventListener('mousedown', (e) => {
            if (activeWindow !== window) {
                if (activeWindow) {
                    activeWindow.classList.remove('active');
                }
                activeWindow = window;
                window.classList.add('active');
                window.style.zIndex = zIndexCounter++;
                
                // Track window opening for achievements
                if (window.achievementSystem) {
                    window.achievementSystem.trackWindowOpen(window.id);
                }
                
                // Actualizar barra de tareas
                updateTaskbar();
            }
        });
        
        // Configurar arrastre de ventanas
        header.addEventListener('mousedown', e => {
            // No iniciar arrastre si se hizo clic en los botones de control
            if (e.target.classList.contains('control')) return;
            
            e.preventDefault();
            isDragging = true;
            offsetX = e.clientX - window.getBoundingClientRect().left;
            offsetY = e.clientY - window.getBoundingClientRect().top;
            document.addEventListener('mousemove', moveWindow);
            document.addEventListener('mouseup', stopMoveWindow);
        });
        
        function moveWindow(e) {
            if (!isDragging) return;
            
            const desktopRect = desktop.getBoundingClientRect();
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            
            // Mantener la ventana dentro del escritorio
            x = Math.max(desktopRect.left, Math.min(x, desktopRect.right - window.offsetWidth));
            y = Math.max(desktopRect.top, Math.min(y, desktopRect.bottom - window.offsetHeight));
            
            window.style.left = `${x}px`;
            window.style.top = `${y}px`;
        }
        
        function stopMoveWindow() {
            isDragging = false;
            document.removeEventListener('mousemove', moveWindow);
            document.removeEventListener('mouseup', stopMoveWindow);
        }
        
        // Configurar botones de control
        const closeBtn = window.querySelector('.close');
        const minBtn = window.querySelector('.minimize');
        const maxBtn = window.querySelector('.maximize');
        
        closeBtn.addEventListener('click', () => {
            window.style.display = 'none';
            if (activeWindow === window) {
                activeWindow = null;
            }
            updateTaskbar();
            
        });
        
        minBtn.addEventListener('click', () => {
            window.style.display = 'none';
            updateTaskbar();
        });
        
        maxBtn.addEventListener('click', () => {
            console.log('Maximize button clicked');
            
            if (window.style.width === '100%' || window.style.width === '100vw') {
                // Restaurar
                console.log('Restoring window');
                window.style.width = window.dataset.prevWidth || '600px';
                window.style.height = window.dataset.prevHeight || '400px';
                window.style.top = window.dataset.prevTop || '50px';
                window.style.left = window.dataset.prevLeft || '50px';
                window.style.maxWidth = '';
                window.style.maxHeight = '';
            } else {
                // Maximizar
                console.log('Maximizing window');
                window.dataset.prevWidth = window.style.width || '600px';
                window.dataset.prevHeight = window.style.height || '400px';
                window.dataset.prevTop = window.style.top || '50px';
                window.dataset.prevLeft = window.style.left || '50px';
                
                // Check if mobile
                if (window.innerWidth <= 480) {
                    window.style.width = '100vw';
                    window.style.height = 'calc(100vh - 60px)';
                    window.style.top = '0';
                    window.style.left = '0';
                    window.style.maxWidth = '100vw';
                    window.style.maxHeight = 'calc(100vh - 60px)';
                } else {
                    window.style.width = '100%';
                    window.style.height = 'calc(100vh - 60px)';
                    window.style.top = '0';
                    window.style.left = '0';
                }
            }
        });
    });
    
    // Inicializar los iconos del escritorio
    icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            // Hide the hint after first interaction
            const hint = document.querySelector('.desktop-hint');
            if (hint) {
                hint.style.display = 'none';
            }
            
            // Cerrar el menú de inicio si está abierto
            if (isStartMenuOpen) {
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            }
            
            // Seleccionar solo este icono
            icons.forEach(i => i.classList.remove('selected'));
            icon.classList.add('selected');
            
            // Abrir ventana inmediatamente con single click
            const windowId = icon.id.replace('-icon', '-window');
            const window = document.getElementById(windowId);
            
            if (window) {
                // Reproducir sonido de clic
                if (window.soundManager) {
                    window.soundManager.play('click');
                }
                
                // Posición aleatoria para las ventanas cuando se abren
                if (!window.style.top) {
                    const maxX = desktop.offsetWidth - 500;
                    const maxY = desktop.offsetHeight - 400;
                    const randomX = Math.floor(Math.random() * maxX);
                    const randomY = Math.floor(Math.random() * maxY);
                    
                    window.style.top = `${Math.max(20, randomY)}px`;
                    window.style.left = `${Math.max(20, randomX)}px`;
                }
                
                // Mostrar la ventana
                window.style.display = 'block';
                
                // Hacer que la ventana sea activa
                if (activeWindow && activeWindow !== window) {
                    activeWindow.classList.remove('active');
                }
                activeWindow = window;
                window.classList.add('active');
                window.style.zIndex = zIndexCounter++;
                
                // Track window opening for achievements
                if (window.achievementSystem) {
                    window.achievementSystem.trackWindowOpen(window.id);
                }
                
                // Actualizar barra de tareas
                updateTaskbar();
            }
        });
        
        // Mantener el doble click para compatibilidad pero sin funcionalidad duplicada
        icon.addEventListener('dblclick', (e) => {
            e.preventDefault(); // Evitar que se ejecute dos veces
        });
    });
    
    // Actualizar la barra de tareas
    function updateTaskbar() {
        const taskbarItems = document.querySelector('.taskbar-items');
        taskbarItems.innerHTML = '';
        
        windows.forEach(window => {
            if (window.style.display !== 'none') {
                const title = window.querySelector('.window-title').textContent;
                const taskbarItem = document.createElement('div');
                taskbarItem.className = 'taskbar-item';
                if (window === activeWindow) {
                    taskbarItem.classList.add('active');
                }
                taskbarItem.textContent = title;
                
                taskbarItem.addEventListener('click', () => {
                    if (window.style.display === 'none') {
                        window.style.display = 'block';
                        if (activeWindow) {
                            activeWindow.classList.remove('active');
                        }
                        activeWindow = window;
                        window.classList.add('active');
                        window.style.zIndex = zIndexCounter++;
                    } else if (window !== activeWindow) {
                        if (activeWindow) {
                            activeWindow.classList.remove('active');
                        }
                        activeWindow = window;
                        window.classList.add('active');
                        window.style.zIndex = zIndexCounter++;
                    } else {
                        window.style.display = 'none';
                        activeWindow = null;
                    }
                    updateTaskbar();
                });
                
                taskbarItems.appendChild(taskbarItem);
            }
        });
    }
    
    // -------------------- MENÚ DE INICIO (VERSIÓN ULTRA SIMPLIFICADA) --------------------
    
    // CORRECCIÓN: Establecer display inicial para el menú
    if (startMenu) {
        startMenu.style.display = 'none';
    }
    
    // Configura el botón de inicio con método directo
    if (startButton) {
        startButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Evitar que el clic se propague
            console.log("Botón de inicio clickeado");
            
            // CORRECCIÓN: Verificar si el menú existe
            if (!startMenu) {
                console.error("Error: No se encontró el elemento del menú de inicio");
                return;
            }
            
            // Toggle usando display directamente sin comprobar el estado actual
            if (isStartMenuOpen) {
                console.log("Cerrando menú");
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            } else {
                console.log("Abriendo menú");
                startMenu.style.display = 'block';
                isStartMenuOpen = true;
            }
        });
    } else {
        console.error("Error: No se encontró el botón de inicio");
    }
    
    // Configurar los elementos del menú de inicio
    const menuItems = document.querySelectorAll('.start-menu-item, .start-menu-right-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar que el clic se propague
            
            const windowId = this.getAttribute('data-window');
            if (windowId) {
                const window = document.getElementById(windowId);
                if (window) {
                    window.style.display = 'block';
                    window.style.zIndex = zIndexCounter++;
                    
                    if (activeWindow) {
                        activeWindow.classList.remove('active');
                    }
                    activeWindow = window;
                    window.classList.add('active');
                    
                    // Posicionar la ventana
                    if (!window.style.top) {
                        const maxX = desktop.offsetWidth - 500;
                        const maxY = desktop.offsetHeight - 400;
                        const randomX = Math.floor(Math.random() * maxX);
                        const randomY = Math.floor(Math.random() * maxY);
                        
                        window.style.top = `${Math.max(20, randomY)}px`;
                        window.style.left = `${Math.max(20, randomX)}px`;
                        window.style.width = '600px';
                        window.style.height = '400px';
                    }
                    
                    updateTaskbar();
                }
            } else if (this.id === 'shutdown') {
                if (confirm('¿Estás seguro de que quieres cerrar esta página?')) {
                    bootScreen.style.display = 'flex';
                    desktop.classList.add('hidden');
                    taskbar.classList.add('hidden');
                    
                    // Reproducir sonido de apagado
                    const shutdownSound = new Audio('https://www.winhistory.de/more/winstart/down/xpshutdown.mp3');
                    shutdownSound.volume = 0.3;
                    shutdownSound.play().catch(error => {
                        console.log("No se pudo reproducir el sonido:", error);
                    });
                    
                    // Simular apagado después de 2 segundos
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
            
            // Cerrar el menú de inicio
            if (startMenu) {
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            }
        });
    });
    
    // Funcionalidad para los enlaces del menú Start
    const githubLink = document.getElementById('github-link');
    const linkedinLink = document.getElementById('linkedin-link');
    const emailLink = document.getElementById('email-link');
    
    if (githubLink) {
        githubLink.addEventListener('click', function(e) {
            e.stopPropagation();
            window.open('https://github.com/SoliDeoGloria123', '_blank');
            
            // Cerrar el menú de inicio
            if (startMenu) {
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            }
        });
    }
    
    if (linkedinLink) {
        linkedinLink.addEventListener('click', function(e) {
            e.stopPropagation();
            window.open('https://www.linkedin.com/in/juan-david-mahecha-sabogal', '_blank');
            
            // Cerrar el menú de inicio
            if (startMenu) {
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            }
        });
    }
    
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.stopPropagation();
            const contactWindow = document.getElementById('contacto');
            if (contactWindow) {
                contactWindow.style.display = 'block';
                contactWindow.style.zIndex = zIndexCounter++;
                
                if (activeWindow) {
                    activeWindow.classList.remove('active');
                }
                activeWindow = contactWindow;
                contactWindow.classList.add('active');
                updateTaskbar();
            }
            
            // Cerrar el menú de inicio
            if (startMenu) {
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            }
        });
    }
    
    // Cerrar el menú al hacer clic en cualquier lugar fuera
    document.addEventListener('click', function(e) {
        if (isStartMenuOpen && 
            startMenu && 
            !startMenu.contains(e.target) && 
            e.target !== startButton && 
            (!startButton || !startButton.contains(e.target))) {
            startMenu.style.display = 'none';
            isStartMenuOpen = false;
        }
    });
    
    // -------------------- FIN DEL CÓDIGO DEL MENÚ DE INICIO --------------------
    
    // Inicializar formulario de contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Validación simple
            if (!name || !email || !message) {
                alert('Por favor completa todos los campos.');
                return;
            }
            
            // Verificación básica del formato de email
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert('Por favor ingresa un email válido.');
                return;
            }
            
            alert(`¡Gracias por tu mensaje, ${name}! Te contactaré pronto.`);
            contactForm.reset();
        });
    }
    
    // Hacer que el escritorio tenga interacción con clic derecho
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        
        // Crear y mostrar menú contextual
        let contextMenu = document.getElementById('context-menu');
        if (contextMenu) contextMenu.remove();
        
        contextMenu = document.createElement('div');
        contextMenu.id = 'context-menu';
        contextMenu.style.position = 'absolute';
        contextMenu.style.left = `${e.clientX}px`;
        contextMenu.style.top = `${e.clientY}px`;
        contextMenu.style.backgroundColor = 'white';
        contextMenu.style.border = '1px solid #a0a0a0';
        contextMenu.style.boxShadow = '2px 2px 5px rgba(0,0,0,0.3)';
        contextMenu.style.borderRadius = '3px';
        contextMenu.style.padding = '2px';
        contextMenu.style.zIndex = '1000';
        
        // Opciones del menú contextual
        const menuItems = [
            { text: 'Actualizar', action: () => location.reload() },
            { text: 'Ver', action: null, separator: true },
            { text: 'Ordenar iconos', action: null },
            { text: 'Pegar', action: null, separator: true },
            { text: 'Propiedades', action: () => alert('Propiedades del portfolio:\n\nAutor: Juan David\nVersión: 1.0\nTema: Windows XP') }
        ];
        
        menuItems.forEach(item => {
            if (item.separator) {
                const separator = document.createElement('div');
                separator.className = 'context-menu-separator';
                contextMenu.appendChild(separator);
            }
            
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.textContent = item.text;
            
            if (item.action) {
                menuItem.addEventListener('click', () => {
                    item.action();
                    contextMenu.remove();
                });
            }
            
            contextMenu.appendChild(menuItem);
        });
        
        document.body.appendChild(contextMenu);
        
        // Cerrar el menú al hacer clic fuera de él
        document.addEventListener('click', function closeMenu(e) {
            if (!contextMenu.contains(e.target)) {
                contextMenu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    });
    
    // Doble clic en el escritorio para quitar selección de iconos
    desktop.addEventListener('click', (e) => {
        // Si el clic fue directamente en el escritorio (no en un icono o ventana)
        if (e.target === desktop) {
            icons.forEach(i => i.classList.remove('selected'));
            
            // Cerrar el menú de inicio si está abierto
            if (isStartMenuOpen && startMenu) {
                startMenu.style.display = 'none';
                isStartMenuOpen = false;
            }
        }
    });
    
    // Manejo de descarga del CV
    const downloadCVBtn = document.getElementById('download-cv-btn');
    if (downloadCVBtn) {
        downloadCVBtn.addEventListener('click', function(e) {
            console.log('📄 Iniciando descarga del CV...');
            
            // Track the CV download achievement
            if (window.achievementSystem) {
                window.achievementSystem.trackCVDownload();
            }
            
            // Play success sound
            if (window.soundManager) {
                window.soundManager.play('success');
            }
            
            // Visual feedback
            const originalText = this.textContent;
            this.textContent = '⬇️ Descargando...';
            this.style.background = '#37a000';
            
            setTimeout(() => {
                this.textContent = '✅ Descargado!';
                setTimeout(() => {
                    this.textContent = originalText;
                    this.style.background = '';
                }, 2000);
            }, 500);
            
            console.log('✅ CV descargado exitosamente');
        });
    }
});
