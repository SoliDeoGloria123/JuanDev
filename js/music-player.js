document.addEventListener('DOMContentLoaded', function () {
    // Esperar a que termine la pantalla de carga
    setTimeout(setupMusicPlayer, 6000);

    function setupMusicPlayer() {
        // Crear el reproductor de música
        const musicPlayer = document.createElement('div');
        musicPlayer.style.position = 'absolute';
        musicPlayer.style.bottom = '50px';
        musicPlayer.style.right = '10px';
        musicPlayer.style.backgroundColor = '#2574b5';
        musicPlayer.style.border = '1px solid #0e3e6e';
        musicPlayer.style.borderRadius = '3px';
        musicPlayer.style.padding = '5px';
        musicPlayer.style.color = 'white';
        musicPlayer.style.fontFamily = 'Tahoma, sans-serif';
        musicPlayer.style.fontSize = '12px';
        musicPlayer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        musicPlayer.style.zIndex = '999';
        musicPlayer.style.width = '220px';
        musicPlayer.id = 'music-player';
        musicPlayer.className = 'music-player';
        musicPlayer.innerHTML = `
            <div class="music-handle">♫</div>
            <div class="music-controls">
                <div class="music-title">Susurros en la lluvia</div>
                <h6 class="music-subtitle" style="text-align:center;">Autor: Juan David</h6>
                <audio id="background-music" loop>
                    <source src="assets/sounds/Whispers in the Rain.mp3" type="audio/mp3">
                </audio>
                <div class="music-buttons">
                    <button id="music-play" class="music-button">▶️</button>
                    <button id="music-pause" class="music-button" style="display:none;">⏸️</button>
                    <button id="music-skip" class="music-button">⏭️</button>
                    <input type="range" id="music-volume" min="0" max="1" step="0.1" value="0.5">
                </div>
            </div>
        `;

        document.body.appendChild(musicPlayer);

        // Playlist
        const playlist = [
            {
                title: "Susurros en la lluvia",
                author: "Autor: Juan David",
                src: "assets/sounds/Whispers in the Rain.mp3"
            },
            {
                title: "Noche Picante",
                author: "Autor: Juan David",
                src: "assets/sounds/Spicy Nights.mp3"
            },
            {
                title: "Susurros Bajo la Luz de la Luna",
                author: "Autor:  Juan David",
                src: "assets/sounds/Whispers in the Moonlight.mp3"
            },
            {
                title: "Oh Tu Fidelidad",
                author: "Autor: Thomas O. Chisholm, Remix: Juan David",
                src: "assets/sounds/Oh Tu fidelidad.mp3"
            }
        ];

        let currentTrack = 0;
        const audio = document.getElementById('background-music');
        const playButton = document.getElementById('music-play');
        const pauseButton = document.getElementById('music-pause');
        const skipButton = document.getElementById('music-skip');
        const volumeControl = document.getElementById('music-volume');
        const musicTitle = document.querySelector('.music-title');
        const musicAuthor = document.querySelector('.music-subtitle');

        // Función para cargar y reproducir una pista
        function loadTrack(trackIndex) {
            audio.src = playlist[trackIndex].src;
            musicTitle.textContent = playlist[trackIndex].title;
            musicAuthor.textContent = playlist[trackIndex].author;
            audio.load();
        }

        // Reproducir música
        playButton.addEventListener('click', function () {
            audio.play();
            playButton.style.display = 'none';
            pauseButton.style.display = 'inline-block';
        });

        // Pausar música
        pauseButton.addEventListener('click', function () {
            audio.pause();
            pauseButton.style.display = 'none';
            playButton.style.display = 'inline-block';
        });

        // Siguiente pista
        skipButton.addEventListener('click', function () {
            currentTrack = (currentTrack + 1) % playlist.length;
            loadTrack(currentTrack);
            if (pauseButton.style.display === 'inline-block') {
                audio.play();
            }
        });

        // Control de volumen
        volumeControl.addEventListener('input', function () {
            audio.volume = volumeControl.value;
        });

        // Hacer el reproductor arrastrable
        const handle = document.querySelector('.music-handle');
        let isDragging = false;
        let offsetX, offsetY;

        handle.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - musicPlayer.getBoundingClientRect().left;
            offsetY = e.clientY - musicPlayer.getBoundingClientRect().top;

            document.addEventListener('mousemove', movePlayer);
            document.addEventListener('mouseup', stopMoving);
        });

        function movePlayer(e) {
            if (isDragging) {
                musicPlayer.style.left = (e.clientX - offsetX) + 'px';
                musicPlayer.style.top = (e.clientY - offsetY) + 'px';
            }
        }

        function stopMoving() {
            isDragging = false;
            document.removeEventListener('mousemove', movePlayer);
            document.removeEventListener('mouseup', stopMoving);
        }

        // Cargar la primera pista
        loadTrack(currentTrack);

        // Reproducir automáticamente al inicio (opcional)
        // audio.play();

        // Estado colapsado/expandido
        handle.addEventListener('dblclick', function () {
            const controls = document.querySelector('.music-controls');
            if (controls.style.display === 'none') {
                controls.style.display = 'block';
            } else {
                controls.style.display = 'none';
            }
        });
    }
});