// Script mejorado para el tutorial
function createTutorial() {
    console.log("Creando tutorial...");
    
    // Eliminar cualquier tutorial existente primero
    const existingTutorial = document.getElementById('tutorial-message');
    if (existingTutorial) {
        console.log("Eliminando tutorial existente");
        document.body.removeChild(existingTutorial);
    }
    
    // Crear el nuevo tutorial
    const tutorialMsg = document.createElement('div');
    tutorialMsg.id = 'tutorial-message';
    
    // Estilos directos para asegurar la visualización correcta
    Object.assign(tutorialMsg.style, {
        position: 'fixed', // Fixed en lugar de absolute para asegurar visibilidad
        bottom: '80px',
        left: '20px',
        backgroundColor: 'rgba(255, 255, 100, 0.95)',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #999',
        maxWidth: '300px',
        boxShadow: '3px 3px 5px rgba(0,0,0,0.3)',
        zIndex: '9999',
        fontFamily: 'Tahoma, Arial, sans-serif',
        fontSize: '12px'
    });
    
    tutorialMsg.innerHTML = `
        <strong>¡Bienvenido a mi portafolio!</strong>
        <ul style="padding-left: 20px; margin: 5px 0;">
            <li>Haz <strong>doble clic</strong> en los iconos para abrir</li>
            <li>Usa el botón <strong>inicio</strong> para acceder al menú</li>
            <li>Arrastra las ventanas por la barra azul superior</li>
            <li>Da clic derecho en el escritorio para ver más opciones</li>
        </ul>
        <div style="text-align: right;">
            <button id="tutorial-button" style="padding: 5px 10px; cursor: pointer; background-color: #e5e5e5; border: 1px solid #999; border-radius: 3px;">Entendido</button>
        </div>
    `;
    
    document.body.appendChild(tutorialMsg);
    console.log("Tutorial añadido al DOM");
    
    // Asignar evento al botón directamente después de añadirlo al DOM
    const tutorialButton = document.getElementById('tutorial-button');
    if (tutorialButton) {
        console.log("Asignando evento al botón del tutorial");
        tutorialButton.addEventListener('click', function() {
            console.log("Botón tutorial clickeado");
            const tutorial = document.getElementById('tutorial-message');
            if (tutorial) {
                document.body.removeChild(tutorial);
                console.log("Tutorial eliminado");
            }
        });
    } else {
        console.error("No se pudo encontrar el botón del tutorial");
    }
}

// Crear y mostrar el tutorial cuando la página haya cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, preparando para mostrar tutorial");
    // Esperar un poco para que otros elementos se muestren primero
    setTimeout(createTutorial, 8000);
});

// Si el DOM ya está cargado, mostrar el tutorial directamente
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("DOM ya cargado, programando tutorial");
    setTimeout(createTutorial, 8000);
}