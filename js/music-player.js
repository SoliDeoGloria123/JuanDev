document.addEventListener('DOMContentLoaded', function () {
    // Esperar a que termine la pantalla de carga
    setTimeout(setupMusicPlayer, 6000);

    function setupMusicPlayer() {
        // Crear el reproductor de música
        const musicPlayer = document.createElement('div');
        musicPlayer.style.position = 'fixed';
        musicPlayer.style.bottom = '60px';
        musicPlayer.style.right = '20px';
        musicPlayer.style.zIndex = '999';
        musicPlayer.style.transition = 'all 0.3s ease';
        musicPlayer.id = 'music-player';
        musicPlayer.className = 'music-player';
        musicPlayer.innerHTML = `
            <!-- Modo minimizado (bolita) -->
            <div class="music-minimized" id="music-minimized" style="display: none;">
                <div class="music-mini-icon">♫</div>
            </div>
            
            <!-- Modo expandido (card) -->
            <div class="music-card" id="music-card">
                <div class="music-card-header">
                    <div class="music-card-title">
                        <span class="music-icon">🎵</span>
                        <span>Reproductor</span>
                    </div>
                    <button class="music-minimize-btn" id="music-minimize">─</button>
                </div>
                
                <div class="music-card-content">
                    <div class="music-info">
                        <div class="music-title">Susurros en la lluvia</div>
                        <div class="music-subtitle">Autor: Juan David</div>
                    </div>
                    
                    <audio id="background-music" loop>
                        <source src="assets/sounds/Whispers in the Rain.mp3" type="audio/mp3">
                    </audio>
                    
                    <div class="music-controls">
                        <button id="music-play" class="music-control-btn">▶️</button>
                        <button id="music-pause" class="music-control-btn" style="display:none;">⏸️</button>
                        <button id="music-skip" class="music-control-btn">⏭️</button>
                    </div>
                    
                    <div class="music-volume-container">
                        <span class="volume-icon">🔊</span>
                        <input type="range" id="music-volume" min="0" max="1" step="0.1" value="0.5" class="music-volume-slider">
                    </div>
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
        let isMinimized = false;
        const audio = document.getElementById('background-music');
        const playButton = document.getElementById('music-play');
        const pauseButton = document.getElementById('music-pause');
        const skipButton = document.getElementById('music-skip');
        const volumeControl = document.getElementById('music-volume');
        const musicTitle = document.querySelector('.music-title');
        const musicAuthor = document.querySelector('.music-subtitle');
        const minimizeButton = document.getElementById('music-minimize');
        const musicCard = document.getElementById('music-card');
        const musicMinimized = document.getElementById('music-minimized');

        // Función para cargar y reproducir una pista
        function loadTrack(trackIndex) {
            audio.src = playlist[trackIndex].src;
            musicTitle.textContent = playlist[trackIndex].title;
            musicAuthor.textContent = playlist[trackIndex].author;
            audio.load();
        }

        // Función para minimizar/expandir el reproductor
        function toggleMinimize() {
            isMinimized = !isMinimized;
            if (isMinimized) {
                musicCard.style.display = 'none';
                musicMinimized.style.display = 'flex';
            } else {
                musicCard.style.display = 'block';
                musicMinimized.style.display = 'none';
            }
        }

        // Event listeners para minimizar/expandir
        minimizeButton.addEventListener('click', toggleMinimize);
        musicMinimized.addEventListener('click', toggleMinimize);

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
            
            // Sincronizar con el botón global de sonido
            const globalSoundButton = document.getElementById('sound-toggle');
            if (globalSoundButton && window.soundManager) {
                if (volumeControl.value == 0 && window.soundManager.soundEnabled) {
                    // Si se pone el volumen a 0, desactivar sonidos globalmente
                    window.soundManager.toggle();
                    globalSoundButton.textContent = '🔇';
                    globalSoundButton.title = 'Activar sonidos';
                    globalSoundButton.classList.add('muted');
                } else if (volumeControl.value > 0 && !window.soundManager.soundEnabled) {
                    // Si se sube el volumen, activar sonidos globalmente
                    window.soundManager.toggle();
                    globalSoundButton.textContent = '🔊';
                    globalSoundButton.title = 'Desactivar sonidos';
                    globalSoundButton.classList.remove('muted');
                }
            }
        });

        // Configurar volumen inicial
        audio.volume = 0.5;
        volumeControl.value = 0.5;
        
        // Cargar la primera pista
        loadTrack(currentTrack);

        // Asegurar que el audio esté listo
        audio.addEventListener('loadeddata', function() {
            console.log('Audio cargado y listo');
        });

        // Hacer el reproductor arrastrable (solo cuando está expandido)
        let isDragging = false;
        let offsetX, offsetY;

        musicCard.addEventListener('mousedown', function (e) {
            if (e.target === minimizeButton) return; // No arrastrar si se hace clic en minimizar
            isDragging = true;
            offsetX = e.clientX - musicPlayer.getBoundingClientRect().left;
            offsetY = e.clientY - musicPlayer.getBoundingClientRect().top;
            musicPlayer.style.cursor = 'grabbing';

            document.addEventListener('mousemove', movePlayer);
            document.addEventListener('mouseup', stopMoving);
        });

        musicMinimized.addEventListener('mousedown', function (e) {
            e.stopPropagation(); // Evitar que se expanda cuando se arrastra
            isDragging = true;
            offsetX = e.clientX - musicPlayer.getBoundingClientRect().left;
            offsetY = e.clientY - musicPlayer.getBoundingClientRect().top;
            musicPlayer.style.cursor = 'grabbing';

            document.addEventListener('mousemove', movePlayer);
            document.addEventListener('mouseup', stopMoving);
        });

        function movePlayer(e) {
            if (isDragging) {
                musicPlayer.style.left = (e.clientX - offsetX) + 'px';
                musicPlayer.style.top = (e.clientY - offsetY) + 'px';
                musicPlayer.style.right = 'auto';
                musicPlayer.style.bottom = 'auto';
            }
        }

        function stopMoving() {
            isDragging = false;
            musicPlayer.style.cursor = 'default';
            document.removeEventListener('mousemove', movePlayer);
            document.removeEventListener('mouseup', stopMoving);
        }

        // Reproducir automáticamente al inicio (opcional)
        // audio.play();
    }
});