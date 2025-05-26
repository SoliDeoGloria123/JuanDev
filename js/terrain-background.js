document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado, preparando fondo...");
    setTimeout(setupBackground, 5000); // Después de la pantalla de carga
});

function setupBackground() {
    // Usar el fondo clásico de Windows XP (Bliss)
    const desktop = document.getElementById('desktop');
    if (desktop) {
        console.log("Aplicando fondo de Windows XP...");
        desktop.style.backgroundImage = "url('https://wallpaperaccess.com/full/1219598.jpg')";
        desktop.style.backgroundSize = "cover";
        desktop.style.backgroundPosition = "center";
    } else {
        console.error("No se encontró el elemento desktop");
    }
}