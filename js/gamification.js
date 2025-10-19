// ===== SOUND EFFECTS AND GAMIFICATION =====

class SoundManager {
    constructor() {
        this.sounds = {
            startup: null,
            click: null,
            hover: null,
            error: null,
            success: null,
            notification: null
        };
        this.soundEnabled = true;
        this.initSounds();
    }

    initSounds() {
        // Create audio contexts for different sounds
        this.sounds.click = this.createSound(200, 0.1, 'square');
        this.sounds.hover = this.createSound(400, 0.05, 'sine');
        this.sounds.error = this.createSound(150, 0.2, 'sawtooth');
        this.sounds.success = this.createSound(600, 0.15, 'sine');
        this.sounds.notification = this.createSound(800, 0.1, 'triangle');
    }

    createSound(frequency, duration, type = 'sine') {
        return () => {
            if (!this.soundEnabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    play(soundName) {
        if (!this.soundEnabled) {
            console.log('Sonidos desactivados - no se reproduce:', soundName);
            return;
        }
        
        if (this.sounds[soundName]) {
            try {
                this.sounds[soundName]();
                console.log('Reproduciendo sonido:', soundName);
            } catch (error) {
                console.warn('Error al reproducir sonido:', soundName, error);
            }
        } else {
            console.warn('Sonido no encontrado:', soundName);
        }
    }

    toggle() {
        this.soundEnabled = !this.soundEnabled;
        
        // Control de música de fondo
        const audio = document.getElementById('background-music');
        const volumeControl = document.getElementById('music-volume');
        const playButton = document.getElementById('music-play');
        const pauseButton = document.getElementById('music-pause');
        
        if (audio && volumeControl) {
            if (this.soundEnabled) {
                // Reactivar música
                audio.volume = volumeControl.value || 0.5;
                if (audio.paused) {
                    audio.play();
                    if (playButton && pauseButton) {
                        playButton.style.display = 'none';
                        pauseButton.style.display = 'inline-block';
                    }
                }
            } else {
                // Silenciar música
                audio.volume = 0;
                if (!audio.paused) {
                    audio.pause();
                    if (playButton && pauseButton) {
                        playButton.style.display = 'inline-block';
                        pauseButton.style.display = 'none';
                    }
                }
            }
        }
        
        return this.soundEnabled;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.animate();
    }

    setupCanvas() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createClickEffect(x, y) {
        const colors = ['#00f', '#0f0', '#f00', '#ff0', '#f0f', '#0ff'];
        
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 4 + 2
            });
        }
    }

    createSuccessEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 15,
                vy: Math.random() * -10 - 5,
                life: 1,
                color: '#4CAF50',
                size: Math.random() * 6 + 3,
                gravity: 0.5
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.02;
            
            if (particle.gravity) {
                particle.vy += particle.gravity;
            }
            
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

class EasterEggManager {
    constructor() {
        this.konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.konamiIndex = 0;
        this.secretClicks = 0;
        this.initEasterEggs();
    }

    initEasterEggs() {
        // Konami code
        document.addEventListener('keydown', (e) => {
            if (e.code === this.konamiCode[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiCode.length) {
                    this.activateKonamiCode();
                    this.konamiIndex = 0;
                }
            } else {
                this.konamiIndex = 0;
            }
        });

        // Secret logo clicks
        const logo = document.querySelector('.windows-logo');
        if (logo) {
            logo.addEventListener('click', () => {
                this.secretClicks++;
                if (this.secretClicks >= 10) {
                    this.activateSecretMode();
                    this.secretClicks = 0;
                }
            });
        }

        // Time-based easter eggs
        this.checkTimeEasterEggs();
    }

    activateKonamiCode() {
        document.body.style.transform = 'rotate(360deg)';
        document.body.style.transition = 'transform 2s';
        
        setTimeout(() => {
            document.body.style.transform = '';
            document.body.style.transition = '';
        }, 2000);

        this.showNotification('🎉 ¡Código Konami activado! ¡Eres un verdadero gamer!');
        soundManager.play('success');
    }

    activateSecretMode() {
        // Rainbow mode
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            .rainbow-mode {
                animation: rainbow 3s linear infinite;
            }
        `;
        document.head.appendChild(style);
        
        document.body.classList.add('rainbow-mode');
        
        setTimeout(() => {
            document.body.classList.remove('rainbow-mode');
            document.head.removeChild(style);
        }, 10000);

        this.showNotification('🌈 ¡Modo arcoíris activado por 10 segundos!');
        soundManager.play('success');
    }

    checkTimeEasterEggs() {
        const now = new Date();
        const hour = now.getHours();
        
        if (hour === 13 && now.getMinutes() === 37) {
            this.showNotification('🕐 ¡Es 1:37! ¡Hora del desarrollador!');
        }
        
        if (hour === 0 && now.getMinutes() === 0) {
            this.showNotification('🌙 ¡Medianoche! ¿Aún programando?');
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            font-weight: bold;
            max-width: 300px;
            animation: slideIn 0.5s ease;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.5s ease reverse';
            setTimeout(() => {
                document.body.removeChild(notification);
                document.head.removeChild(style);
            }, 500);
        }, 3000);
    }
}

class AchievementSystem {
    constructor() {
        this.achievements = {
            'first_visit': { name: '👋 Primer Visitante', description: 'Visitaste mi portafolio por primera vez' },
            'explorer': { name: '🔍 Explorador', description: 'Abriste todas las ventanas' },
            'gamer': { name: '🎮 Gamer', description: 'Jugaste un videojuego' },
            'communicator': { name: '📧 Comunicador', description: 'Enviaste un mensaje de contacto' },
            'time_spender': { name: '⏰ Dedicado', description: 'Pasaste más de 5 minutos en el sitio' },
            'cv_reader': { name: '📄 Reclutador', description: 'Descargaste mi CV' },
            'music_lover': { name: '🎵 Melómano', description: 'Reprodujiste música' },
            'persistent': { name: '💪 Persistente', description: 'Visitaste el sitio 3 veces' }
        };
        
        this.unlockedAchievements = JSON.parse(localStorage.getItem('achievements') || '[]');
        this.stats = JSON.parse(localStorage.getItem('portfolioStats') || '{}');
        
        this.initTracking();
    }

    initTracking() {
        // Track first visit
        if (!this.stats.firstVisit) {
            this.stats.firstVisit = Date.now();
            this.unlock('first_visit');
        }
        
        // Track visit count
        this.stats.visitCount = (this.stats.visitCount || 0) + 1;
        if (this.stats.visitCount >= 3) {
            this.unlock('persistent');
        }
        
        // Track time spent
        this.stats.startTime = Date.now();
        setInterval(() => {
            const timeSpent = Date.now() - this.stats.startTime;
            if (timeSpent > 5 * 60 * 1000) { // 5 minutes
                this.unlock('time_spender');
            }
        }, 60000);
        
        // Track window opens
        this.stats.windowsOpened = this.stats.windowsOpened || [];
        
        this.saveStats();
    }

    unlock(achievementId) {
        if (!this.unlockedAchievements.includes(achievementId)) {
            this.unlockedAchievements.push(achievementId);
            localStorage.setItem('achievements', JSON.stringify(this.unlockedAchievements));
            this.showAchievement(this.achievements[achievementId]);
            soundManager.play('success');
        }
    }

    trackWindowOpen(windowId) {
        if (!this.stats.windowsOpened.includes(windowId)) {
            this.stats.windowsOpened.push(windowId);
            this.saveStats();
            
            const allWindows = ['about-window', 'projects-window', 'games-window', 'photos-window', 'contact-window', 'resume-window'];
            if (this.stats.windowsOpened.length >= allWindows.length) {
                this.unlock('explorer');
            }
        }
    }

    trackGamePlay() {
        this.unlock('gamer');
    }

    trackContactSent() {
        this.unlock('communicator');
    }

    trackCVDownload() {
        this.unlock('cv_reader');
    }

    trackMusicPlay() {
        this.unlock('music_lover');
    }

    showAchievement(achievement) {
        const achievementEl = document.createElement('div');
        achievementEl.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: #8b6914;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            z-index: 10000;
            text-align: center;
            font-weight: bold;
            border: 3px solid #ffb300;
            animation: achievementPop 3s ease;
            max-width: 350px;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes achievementPop {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                20% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                25% { transform: translate(-50%, -50%) scale(1); }
                90% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        achievementEl.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 10px;">🏆 ¡Logro Desbloqueado!</div>
            <div style="font-size: 18px; margin-bottom: 5px;">${achievement.name}</div>
            <div style="font-size: 14px; font-weight: normal;">${achievement.description}</div>
        `;
        
        document.body.appendChild(achievementEl);
        
        // Create particle effect
        particleSystem.createSuccessEffect(window.innerWidth / 2, window.innerHeight / 2);
        
        setTimeout(() => {
            document.body.removeChild(achievementEl);
            document.head.removeChild(style);
        }, 3000);
    }

    saveStats() {
        localStorage.setItem('portfolioStats', JSON.stringify(this.stats));
    }

    getProgress() {
        return {
            total: Object.keys(this.achievements).length,
            unlocked: this.unlockedAchievements.length,
            percentage: Math.round((this.unlockedAchievements.length / Object.keys(this.achievements).length) * 100)
        };
    }
}

// Global instances
let soundManager, particleSystem, easterEggManager, achievementSystem;

// Initialize gamification systems
document.addEventListener('DOMContentLoaded', () => {
    soundManager = new SoundManager();
    particleSystem = new ParticleSystem();
    easterEggManager = new EasterEggManager();
    achievementSystem = new AchievementSystem();
    
    // Add sound effects to existing interactions
    addSoundEffects();
    addMicroInteractions();
    addProgressIndicators();
    initSoundToggle();
});

function initSoundToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
        // Set initial state
        soundToggle.textContent = '🔊';
        soundToggle.title = 'Desactivar sonidos';
        
        soundToggle.addEventListener('click', () => {
            const isEnabled = soundManager.toggle();
            soundToggle.classList.toggle('muted', !isEnabled);
            
            // Update icon and title
            if (isEnabled) {
                soundToggle.textContent = '🔊';
                soundToggle.title = 'Desactivar sonidos';
            } else {
                soundToggle.textContent = '🔇';
                soundToggle.title = 'Activar sonidos';
            }
            
            // Visual feedback
            soundToggle.style.transform = 'scale(0.9)';
            setTimeout(() => {
                soundToggle.style.transform = 'scale(1)';
            }, 100);
            
            console.log('Sonidos:', isEnabled ? 'activados' : 'desactivados');
            console.log('Control unificado: música y efectos', isEnabled ? 'activados' : 'desactivados');
        });
    }
}

function addSoundEffects() {
    // Add click sounds to buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('button, .icon, .xp-button, .window-controls button')) {
            soundManager.play('click');
            
            // Add click effect
            const rect = e.target.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            particleSystem.createClickEffect(x, y);
        }
    });
    
    // Add hover sounds
    document.addEventListener('mouseover', (e) => {
        if (e.target.matches('.icon, .xp-button, .game-card, .project-card')) {
            soundManager.play('hover');
        }
    });
}

function addMicroInteractions() {
    // Add ripple effect to clickable elements
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: relative;
            overflow: hidden;
        }
        
        .ripple::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
        }
        
        .ripple:active::after {
            width: 200px;
            height: 200px;
        }
        
        .glow-on-hover {
            transition: all 0.3s ease;
        }
        
        .glow-on-hover:hover {
            box-shadow: 0 0 20px rgba(0, 85, 229, 0.5);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    // Add ripple effect to buttons
    document.querySelectorAll('.xp-button, .icon').forEach(el => {
        el.classList.add('ripple', 'glow-on-hover');
    });
}

function addProgressIndicators() {
    // Add progress bar for achievements
    const progressContainer = document.createElement('div');
    progressContainer.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 6px;
        font-size: 12px;
        z-index: 9999;
        cursor: pointer;
    `;
    
    const progress = achievementSystem.getProgress();
    progressContainer.innerHTML = `🏆 ${progress.unlocked}/${progress.total} (${progress.percentage}%)`;
    
    progressContainer.addEventListener('click', () => {
        easterEggManager.showNotification(`Logros desbloqueados: ${progress.unlocked}/${progress.total}`);
    });
    
    document.body.appendChild(progressContainer);
    
    // Update progress periodically
    setInterval(() => {
        const newProgress = achievementSystem.getProgress();
        progressContainer.innerHTML = `🏆 ${newProgress.unlocked}/${newProgress.total} (${newProgress.percentage}%)`;
    }, 5000);
}

// Export for use in other files
window.soundManager = soundManager;
window.particleSystem = particleSystem;
window.achievementSystem = achievementSystem;