// ===== GAMES FUNCTIONALITY =====

class GameManager {
    constructor() {
        this.currentGame = null;
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameRunning = false;
        
        // Make canvas focusable and set up for keyboard input
        this.canvas.tabIndex = 0;
        this.canvas.style.outline = 'none';
        
        this.initGameEvents();
    }

    initGameEvents() {
        // Game card click events
        document.querySelectorAll('.play-game').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameType = e.target.getAttribute('data-game');
                this.startGame(gameType);
            });
        });

        // Game control events
        document.getElementById('pause-game').addEventListener('click', () => this.pauseGame());
        document.getElementById('close-game').addEventListener('click', () => this.closeGame());
        
        // Keyboard events - multiple event listeners for better compatibility
        document.addEventListener('keydown', (e) => this.globalKeyHandler(e));
        window.addEventListener('keydown', (e) => this.globalKeyHandler(e));
        
        // Canvas specific events
        this.canvas.addEventListener('keydown', (e) => this.globalKeyHandler(e));

        // Mobile touch controls
        this.initMobileTouchControls();
    }

    globalKeyHandler(e) {
        if (this.gameRunning && this.currentGame) {
            // Debug log
            console.log('Key pressed:', e.key, 'Game running:', this.gameRunning, 'Current game:', this.currentGame.constructor.name);
            
            e.preventDefault(); // Prevent default browser behavior
            e.stopPropagation(); // Stop event propagation
            
            this.handleKeyPress(e);
            
            // Ensure canvas has focus
            if (this.canvas) {
                this.canvas.focus();
            }
        }
    }

    initMobileTouchControls() {
        // Create mobile control overlay ONLY when needed
        const controlsContainer = document.createElement('div');
        controlsContainer.id = 'mobile-controls';
        controlsContainer.style.cssText = `
            display: none;
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 20px;
            padding: 20px;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            pointer-events: auto;
            visibility: hidden;
            opacity: 0;
            border: 2px solid #00d4ff;
        `;
        
        // Debug indicator
        const debugInfo = document.createElement('div');
        debugInfo.textContent = '🎮 Controls Active';
        debugInfo.style.cssText = `
            color: #00d4ff;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
        `;
        controlsContainer.appendChild(debugInfo);

        // D-pad style controls
        const dPad = document.createElement('div');
        dPad.style.cssText = `
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr 1fr;
            gap: 5px;
            width: 150px;
            height: 150px;
        `;

        const buttons = [
            { pos: '2 / 2', direction: 'up', text: '▲', key: 'ArrowUp' },
            { pos: '2 / 1', direction: 'left', text: '◀', key: 'ArrowLeft' },
            { pos: '2 / 3', direction: 'right', text: '▶', key: 'ArrowRight' },
            { pos: '3 / 2', direction: 'down', text: '▼', key: 'ArrowDown' }
        ];

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.text;
            button.className = 'mobile-control-btn';
            button.setAttribute('data-key', btn.key);
            button.style.cssText = `
                grid-area: ${btn.pos};
                background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
                color: #00d4ff;
                border: 1px solid rgba(0, 212, 255, 0.5);
                border-radius: 50%;
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.1s;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                pointer-events: auto;
                z-index: 10001;
                width: 50px;
                height: 50px;
                min-width: 50px;
                min-height: 50px;
            `;
            button.textContent = btn.text;
            
            const handlePress = () => {
                console.log('🎮 Control button pressed:', btn.key);
                button.style.background = 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)';
                button.style.color = 'white';
                button.style.transform = 'scale(0.95)';
                
                // Multiple approaches to ensure the key press is registered
                
                // 1. Try direct game method
                if (this.currentGame && this.gameRunning) {
                    console.log('🎯 Forwarding to currentGame:', btn.key);
                    if (this.currentGame.handleKeyPress) {
                        this.currentGame.handleKeyPress({ key: btn.key });
                    } else {
                        // Try direct method calls for specific games
                        switch(btn.key) {
                            case 'ArrowUp': this.currentGame.moveUp && this.currentGame.moveUp(); break;
                            case 'ArrowDown': this.currentGame.moveDown && this.currentGame.moveDown(); break;
                            case 'ArrowLeft': this.currentGame.moveLeft && this.currentGame.moveLeft(); break;
                            case 'ArrowRight': this.currentGame.moveRight && this.currentGame.moveRight(); break;
                        }
                    }
                }
                
                // 2. Keyboard event simulation
                const keyEvent = new KeyboardEvent('keydown', {
                    key: btn.key,
                    code: btn.key,
                    bubbles: true,
                    cancelable: true
                });
                
                // Dispatch to multiple targets
                document.dispatchEvent(keyEvent);
                if (this.canvas) {
                    this.canvas.dispatchEvent(keyEvent);
                }
                
                console.log('✅ Mobile control executed for:', btn.key);
            };

            const handleRelease = () => {
                console.log('🎮 Control button released:', btn.key);
                button.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
                button.style.color = '#00d4ff';
                button.style.transform = 'scale(1)';
                
                // Send keyup event
                const keyEvent = new KeyboardEvent('keyup', {
                    key: btn.key,
                    code: btn.key,
                    bubbles: true,
                    cancelable: true
                });
                
                document.dispatchEvent(keyEvent);
                if (this.canvas) {
                    this.canvas.dispatchEvent(keyEvent);
                }
            };

            // Touch events (primary for mobile)
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Touch start on button:', btn.key);
                handlePress();
            }, { passive: false });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Touch end on button:', btn.key);
                handleRelease();
            }, { passive: false });
            
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRelease();
            }, { passive: false });

            // Mouse events for testing (including click)
            button.addEventListener('mousedown', (e) => {
                if (e && e.preventDefault) e.preventDefault();
                if (e && e.stopPropagation) e.stopPropagation();
                console.log('Mouse down on button:', btn.key);
                handlePress();
            });
            button.addEventListener('mouseup', (e) => {
                if (e && e.preventDefault) e.preventDefault();
                if (e && e.stopPropagation) e.stopPropagation();
                handleRelease();
            });
            button.addEventListener('click', (e) => {
                if (e && e.preventDefault) e.preventDefault();
                if (e && e.stopPropagation) e.stopPropagation();
                console.log('Click on button:', btn.key);
                handlePress();
                setTimeout(handleRelease, 150);
            });
            button.addEventListener('mouseleave', handleRelease);

            dPad.appendChild(button);
        });

        controlsContainer.appendChild(dPad);
        
        // DON'T add to DOM immediately
        this.mobileControls = controlsContainer;
        this.mobileControlsInDOM = false;
        
        console.log('Mobile controls created but NOT added to DOM');
    }

    startGame(gameType) {
        this.closeGame(); // Close any existing game
        
        // Track game play for achievements
        if (window.achievementSystem) {
            window.achievementSystem.trackGamePlay();
        }
        
        const container = document.getElementById('game-canvas-container');
        const title = document.getElementById('current-game-title');
        const instructions = document.getElementById('game-instructions');
        
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
        
        // Make canvas focusable and add click handler
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.style.outline = 'none';
        this.canvas.addEventListener('click', () => {
            this.canvas.focus();
            console.log('Canvas clicked and focused');
        });
        
        // Hide mobile controls by default when no game is active
        if (this.mobileControls) {
            this.mobileControls.style.display = 'none';
            this.mobileControls.style.visibility = 'hidden';
            this.mobileControls.style.pointerEvents = 'none';
        }
        
        // Show mobile controls for games that need them
        const needsControls = gameType === 'snake' || gameType === 'tetris' || gameType === 'pong';
        const isMobileOrTouch = window.innerWidth <= 768 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (needsControls) {
            // Add to DOM immediately if needed
            if (!this.mobileControlsInDOM) {
                document.body.appendChild(this.mobileControls);
                this.mobileControlsInDOM = true;
                console.log('📱 Mobile controls added to DOM');
            }
            
            // Show controls immediately with force
            this.mobileControls.style.display = 'flex !important';
            this.mobileControls.style.visibility = 'visible !important';
            this.mobileControls.style.opacity = '1 !important';
            this.mobileControls.style.pointerEvents = 'auto !important';
            this.mobileControls.style.zIndex = '10000 !important';
            this.mobileControls.classList.add('active');
            
            console.log('🎮 Mobile controls FORCE SHOWN for game:', gameType);
            console.log('🔍 Controls element:', this.mobileControls);
            console.log('🔍 Controls in DOM:', this.mobileControls.parentElement ? 'YES' : 'NO');
            
            // Double-check after a moment
            setTimeout(() => {
                if (this.mobileControls) {
                    const rect = this.mobileControls.getBoundingClientRect();
                    console.log('📐 Controls position:', rect);
                    console.log('👁️ Controls visible:', window.getComputedStyle(this.mobileControls).display);
                }
            }, 200);
        }
        
        switch(gameType) {
            case 'snake':
                title.textContent = '🐍 Snake Game';
                instructions.innerHTML = '<p>Usa las teclas de flecha o los controles táctiles para moverte. ¡Come la comida roja sin chocar contigo mismo!</p>';
                this.currentGame = new SnakeGame(this.canvas, this.ctx);
                break;
            case 'memory':
                title.textContent = '🧠 Memory Game';
                instructions.innerHTML = '<p>¡Haz clic en las cartas para encontrar las parejas!</p>';
                this.currentGame = new MemoryGame(this.canvas, this.ctx);
                // Hide mobile controls for memory game (uses click/touch)
                if (this.mobileControls) this.mobileControls.classList.remove('active');
                break;
            case 'tetris':
                title.textContent = '🟦 Tetris Clone';
                instructions.innerHTML = '<p>Usa las flechas o los controles táctiles para mover y rotar. ¡Completa líneas para ganar puntos!</p>';
                this.currentGame = new TetrisGame(this.canvas, this.ctx);
                break;
            case 'pong':
                title.textContent = '🏓 Pong';
                instructions.innerHTML = '<p>Usa las flechas arriba/abajo o los controles táctiles para mover tu paleta</p>';
                this.currentGame = new PongGame(this.canvas, this.ctx);
                break;
        }
        
        if (this.currentGame) {
            this.gameRunning = true;
            this.currentGame.start();
            
            // Ensure canvas receives focus for keyboard events
            setTimeout(() => {
                if (this.canvas) {
                    this.canvas.focus();
                    console.log('Canvas focused for game:', gameType);
                }
            }, 100);
            
            // Add click event to canvas to maintain focus
            this.canvas.addEventListener('click', () => {
                this.canvas.focus();
            });
        }
    }

    pauseGame() {
        if (this.currentGame && this.gameRunning) {
            this.currentGame.pause();
            this.gameRunning = false;
            document.getElementById('pause-game').textContent = 'Resume';
            
            // Hide controls when paused
            if (this.mobileControls) {
                this.mobileControls.classList.remove('active');
                console.log('Mobile controls hidden - game paused');
            }
        } else if (this.currentGame) {
            this.currentGame.resume();
            this.gameRunning = true;
            document.getElementById('pause-game').textContent = 'Pause';
            
            // Show controls when resumed (only for directional games)
            const gameType = this.currentGame.constructor.name.toLowerCase().replace('game', '');
            if ((gameType === 'snake' || gameType === 'tetris' || gameType === 'pong') && this.mobileControls) {
                this.mobileControls.classList.add('active');
                console.log('Mobile controls shown - game resumed');
            }
        }
    }

    closeGame() {
        if (this.currentGame) {
            this.currentGame.stop();
        }
        this.currentGame = null;
        this.gameRunning = false;
        document.getElementById('game-canvas-container').style.display = 'none';
        document.getElementById('pause-game').textContent = 'Pause';
        
        // Always hide mobile controls when closing any game
        if (this.mobileControls) {
            this.mobileControls.classList.remove('active');
            
            // Remove from DOM completely
            if (this.mobileControlsInDOM && this.mobileControls.parentNode) {
                this.mobileControls.parentNode.removeChild(this.mobileControls);
                this.mobileControlsInDOM = false;
                console.log('Mobile controls removed from DOM');
            }
            console.log('Mobile controls hidden - game closed');
        }
    }

    handleKeyPress(e) {
        console.log('handleKeyPress called with key:', e.key);
        if (this.currentGame && this.gameRunning && typeof this.currentGame.handleKeyPress === 'function') {
            // Ensure the game method is called with the event
            this.currentGame.handleKeyPress(e);
            console.log('Key forwarded to game:', this.currentGame.constructor.name);
        } else {
            console.log('Key not forwarded - Game running:', this.gameRunning, 'Current game:', this.currentGame);
        }
    }

    updateScore(score) {
        document.getElementById('current-score').textContent = `Score: ${score}`;
    }
}

// Simple Snake Game
class SnakeGame {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.gridSize = 20;
        this.tileCount = canvas.width / this.gridSize;
        
        this.snake = [
            {x: 10, y: 10}
        ];
        this.food = {x: 15, y: 15};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameLoop = null;
    }

    start() {
        this.gameLoop = setInterval(() => this.update(), 150);
        this.draw();
    }

    update() {
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            gameManager.updateScore(this.score);
            this.generateFood();
        } else {
            this.snake.pop();
        }
        
        this.draw();
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#0f0';
        this.snake.forEach(segment => {
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        });
        
        // Draw food
        this.ctx.fillStyle = '#f00';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
    }

    generateFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        
        // Make sure food doesn't spawn on snake
        if (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y)) {
            this.generateFood();
        }
    }

    handleKeyPress(e) {
        const key = e.key;
        console.log('SnakeGame handleKeyPress called with key:', key);
        
        // Prevent default browser behavior for arrow keys (safely)
        if (key && key.startsWith && key.startsWith('Arrow')) {
            if (e && e.preventDefault && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
        }
        
        if (key === 'ArrowLeft' && this.dx === 0) {
            this.dx = -1;
            this.dy = 0;
            console.log('Snake moved left');
        } else if (key === 'ArrowUp' && this.dy === 0) {
            this.dx = 0;
            this.dy = -1;
            console.log('Snake moved up');
        } else if (key === 'ArrowRight' && this.dx === 0) {
            this.dx = 1;
            this.dy = 0;
            console.log('Snake moved right');
        } else if (key === 'ArrowDown' && this.dy === 0) {
            this.dx = 0;
            this.dy = 1;
            console.log('Snake moved down');
        }
    }

    gameOver() {
        this.stop();
        alert(`Game Over! Score: ${this.score}`);
        
        // Update best score
        const bestScore = localStorage.getItem('snakeBest') || 0;
        if (this.score > bestScore) {
            localStorage.setItem('snakeBest', this.score);
            document.getElementById('snake-best').textContent = this.score;
        }
    }

    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    pause() {
        this.stop();
    }

    resume() {
        this.start();
    }
}

// Simple Memory Game
class MemoryGame {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.startTime = Date.now();
        this.cardSize = 80;
        this.gap = 10;
        this.cols = 4;
        this.rows = 4;
        
        this.setupCards();
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick(e.touches[0] || e);
        });
    }

    setupCards() {
        const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🥝', '🍑'];
        const pairs = [...symbols, ...symbols];
        const shuffled = pairs.sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.cards.push({
                    x: j * (this.cardSize + this.gap) + this.gap,
                    y: i * (this.cardSize + this.gap) + this.gap,
                    symbol: shuffled[i * this.cols + j],
                    flipped: false,
                    matched: false
                });
            }
        }
    }

    start() {
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = '#1e3a8a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.cards.forEach(card => {
            this.ctx.fillStyle = card.flipped || card.matched ? '#fff' : '#3b82f6';
            this.ctx.fillRect(card.x, card.y, this.cardSize, this.cardSize);
            
            this.ctx.strokeStyle = '#1e40af';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(card.x, card.y, this.cardSize, this.cardSize);
            
            if (card.flipped || card.matched) {
                this.ctx.fillStyle = '#000';
                this.ctx.font = '30px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(card.symbol, card.x + this.cardSize/2, card.y + this.cardSize/2 + 10);
            }
        });
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const clickedCard = this.cards.find(card => 
            x >= card.x && x <= card.x + this.cardSize &&
            y >= card.y && y <= card.y + this.cardSize
        );
        
        if (clickedCard && !clickedCard.flipped && !clickedCard.matched && this.flippedCards.length < 2) {
            clickedCard.flipped = true;
            this.flippedCards.push(clickedCard);
            
            if (this.flippedCards.length === 2) {
                setTimeout(() => this.checkMatch(), 1000);
            }
            
            this.draw();
        }
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs++;
            this.score += 100;
            
            if (this.matchedPairs === 8) {
                this.gameWon();
            }
        } else {
            card1.flipped = false;
            card2.flipped = false;
        }
        
        this.flippedCards = [];
        gameManager.updateScore(this.score);
        this.draw();
    }

    gameWon() {
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        alert(`¡Felicidades! Completaste el juego en ${timeElapsed} segundos`);
        
        const bestTime = localStorage.getItem('memoryBest') || 999;
        if (timeElapsed < bestTime) {
            localStorage.setItem('memoryBest', timeElapsed);
            const minutes = Math.floor(timeElapsed / 60);
            const seconds = timeElapsed % 60;
            document.getElementById('memory-best').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    stop() {}
    pause() {}
    resume() {}
    handleKeyPress() {}
}

// Simple Tetris Game (basic version)
class TetrisGame {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.gameLoop = null;
        
        // Simple falling blocks demo with basic controls
        this.blocks = [];
        this.blockSize = 20;
        this.currentBlock = null;
        this.spawnTimer = 0;
        this.spawnRate = 120; // frames between spawns
    }

    start() {
        this.gameLoop = setInterval(() => this.update(), 100);
        this.spawnBlock();
    }

    spawnBlock() {
        this.currentBlock = {
            x: Math.floor(Math.random() * (this.canvas.width / this.blockSize - 1)) * this.blockSize,
            y: 0,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            speed: 1
        };
    }

    update() {
        if (this.currentBlock) {
            this.currentBlock.y += this.blockSize * this.currentBlock.speed;
            
            if (this.currentBlock.y > this.canvas.height) {
                this.blocks.push({...this.currentBlock, y: this.canvas.height - this.blockSize});
                this.score += 10;
                gameManager.updateScore(this.score);
                this.spawnBlock();
            }
        }
        
        this.draw();
    }

    handleKeyPress(e) {
        const key = e.key;
        console.log('TetrisGame handleKeyPress called with key:', key);
        
        // Prevent default browser behavior for arrow keys (safely)
        if (key && key.startsWith && key.startsWith('Arrow')) {
            if (e && e.preventDefault && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
        }
        
        if (this.currentBlock) {
            if (key === 'ArrowLeft' && this.currentBlock.x > 0) {
                this.currentBlock.x -= this.blockSize;
                console.log('Block moved left');
            } else if (key === 'ArrowRight' && this.currentBlock.x < this.canvas.width - this.blockSize) {
                this.currentBlock.x += this.blockSize;
                console.log('Block moved right');
            } else if (key === 'ArrowDown') {
                this.currentBlock.speed = 3; // Fast drop
                console.log('Block speed increased');
            } else if (key === 'ArrowUp') {
                // Rotate color for demo (in real Tetris this would rotate the piece)
                this.currentBlock.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
                console.log('Block color rotated');
            }
        }
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw placed blocks
        this.blocks.forEach(block => {
            this.ctx.fillStyle = block.color;
            this.ctx.fillRect(block.x, block.y, this.blockSize, this.blockSize);
            this.ctx.strokeStyle = '#333';
            this.ctx.strokeRect(block.x, block.y, this.blockSize, this.blockSize);
        });
        
        // Draw current falling block
        if (this.currentBlock) {
            this.ctx.fillStyle = this.currentBlock.color;
            this.ctx.fillRect(this.currentBlock.x, this.currentBlock.y, this.blockSize, this.blockSize);
            this.ctx.strokeStyle = '#fff';
            this.ctx.strokeRect(this.currentBlock.x, this.currentBlock.y, this.blockSize, this.blockSize);
        }
    }

    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }

    pause() { this.stop(); }
    resume() { this.start(); }
}

// Simple Pong Game
class PongGame {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.paddle = { x: 10, y: canvas.height / 2 - 40, width: 10, height: 80 };
        this.aiPaddle = { x: canvas.width - 20, y: canvas.height / 2 - 40, width: 10, height: 80 };
        this.ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: 3, size: 10 };
        this.score = 0;
        this.gameLoop = null;
    }

    start() {
        this.gameLoop = setInterval(() => this.update(), 16);
    }

    update() {
        // Move ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
        
        // Ball collision with top/bottom
        if (this.ball.y <= 0 || this.ball.y >= this.canvas.height) {
            this.ball.dy = -this.ball.dy;
        }
        
        // Ball collision with paddles
        if (this.ball.x <= this.paddle.x + this.paddle.width &&
            this.ball.y >= this.paddle.y && this.ball.y <= this.paddle.y + this.paddle.height) {
            this.ball.dx = -this.ball.dx;
            this.score += 10;
            gameManager.updateScore(this.score);
        }
        
        // AI paddle movement
        this.aiPaddle.y += (this.ball.y - this.aiPaddle.y - this.aiPaddle.height / 2) * 0.1;
        
        // Reset ball if it goes off screen
        if (this.ball.x < 0 || this.ball.x > this.canvas.width) {
            this.ball.x = this.canvas.width / 2;
            this.ball.y = this.canvas.height / 2;
            this.ball.dx = -this.ball.dx;
        }
        
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw paddles
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
        this.ctx.fillRect(this.aiPaddle.x, this.aiPaddle.y, this.aiPaddle.width, this.aiPaddle.height);
        
        // Draw ball
        this.ctx.fillRect(this.ball.x, this.ball.y, this.ball.size, this.ball.size);
    }

    handleKeyPress(e) {
        const key = e.key;
        console.log('PongGame handleKeyPress called with key:', key);
        
        // Prevent default browser behavior for arrow keys (safely)
        if (key && key.startsWith && key.startsWith('Arrow')) {
            if (e && e.preventDefault && typeof e.preventDefault === 'function') {
                e.preventDefault();
            }
        }
        
        if (key === 'ArrowUp' && this.paddle.y > 0) {
            this.paddle.y -= 20;
            console.log('Paddle moved up to:', this.paddle.y);
        } else if (key === 'ArrowDown' && this.paddle.y < this.canvas.height - this.paddle.height) {
            this.paddle.y += 20;
            console.log('Paddle moved down to:', this.paddle.y);
        }
        
        // Force redraw
        this.draw();
    }

    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }

    pause() { this.stop(); }
    resume() { this.start(); }
}

// ===== CONTACT FORM FUNCTIONALITY =====

class ContactManager {
    constructor() {
        this.initEmailJS();
        this.initContactEvents();
        this.loadBestScores();
    }

    initEmailJS() {
        // Initialize EmailJS with your credentials from config
        try {
            if (typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG) {
                emailjs.init(window.EMAILJS_CONFIG.PUBLIC_KEY);
                console.log('EmailJS initialized successfully');
                
                // Check if properly configured
                if (window.isEmailJSConfigured && window.isEmailJSConfigured()) {
                    console.log('✅ EmailJS está configurado correctamente');
                } else {
                    console.warn('⚠️ EmailJS no está configurado. Edita js/emailjs-config.js');
                }
            } else {
                console.error('❌ EmailJS o configuración no disponible');
            }
        } catch (error) {
            console.error('Error initializing EmailJS:', error);
        }
    }

    initContactEvents() {
        // Tab switching
        document.querySelectorAll('.contact-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // Form submission
        const form = document.getElementById('contact-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }
    }

    switchTab(tabName) {
        // Remove active class from all tabs and contents
        document.querySelectorAll('.contact-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.contact-tab-content').forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const formStatus = document.getElementById('form-status');
        
        // Show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        formStatus.style.display = 'none';
        
        try {
            const formData = new FormData(e.target);
            const templateParams = {
                from_name: formData.get('from_name'),
                from_email: formData.get('from_email'),
                company: formData.get('company'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                to_name: 'Juan David Mahecha Sabogal',
                to_email: window.EMAILJS_CONFIG?.TO_EMAIL || 'juan.juand.dev@gmail.com'
            };

            // Check if EmailJS is properly configured
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS no está disponible. Verifica que se cargó correctamente.');
            }
            
            if (!window.isEmailJSConfigured || !window.isEmailJSConfigured()) {
                this.showFormStatus('info', `
                    📧 <strong>EmailJS no está configurado con credenciales reales</strong><br><br>
                    
                    💌 <strong>Para contactarme directamente:</strong><br>
                    📧 Email: <a href="mailto:juan.juand.dev@gmail.com" style="color: #007bff;">juan.juand.dev@gmail.com</a><br>
                    📱 WhatsApp: <a href="https://wa.me/573115024430" target="_blank" style="color: #25d366;">+57 311 502 44 30</a><br>
                    💼 LinkedIn: <a href="https://www.linkedin.com/in/juan-david-mahecha-sabogal" target="_blank" style="color: #0077b5;">Juan David Mahecha</a><br><br>
                    
                    🚀 <strong>¡También puedes contactarme por cualquiera de estos medios!</strong>
                `);
                e.target.reset();
                return;
            }
            
            // Send email using EmailJS
            try {
                await emailjs.send(
                    window.EMAILJS_CONFIG.SERVICE_ID, 
                    window.EMAILJS_CONFIG.TEMPLATE_ID, 
                    templateParams
                );
                this.showFormStatus('success', '✅ ¡Mensaje enviado exitosamente! Te responderé pronto.');
                e.target.reset();
                
                // Track successful submission for achievements
                if (window.achievementSystem) {
                    window.achievementSystem.trackContactSent();
                }
            } catch (emailError) {
                console.error('EmailJS error:', emailError);
                
                // Show specific error messages
                let errorMessage = '❌ <strong>Error al enviar el mensaje</strong><br><br>';
                
                if (emailError.text) {
                    if (emailError.text.includes('The Public Key is invalid')) {
                        errorMessage += `
                            🔑 <strong>Problema de configuración:</strong> La clave pública no es válida.<br><br>
                            
                            📧 <strong>Pero no te preocupes, puedes contactarme directamente:</strong><br>
                            📧 Email: <a href="mailto:juan.juand.dev@gmail.com" style="color: #007bff;">juan.juand.dev@gmail.com</a><br>
                            📞 WhatsApp: <a href="https://wa.me/573115024430" target="_blank" style="color: #25d366;">+57 311 502 44 30</a><br>
                            💼 LinkedIn: <a href="https://www.linkedin.com/in/juan-david-mahecha-sabogal" target="_blank" style="color: #0077b5;">Juan David Mahecha</a>
                        `;
                    } else if (emailError.text.includes('template')) {
                        errorMessage += 'Problema con el template de email.';
                    } else if (emailError.text.includes('service')) {
                        errorMessage += 'Problema con el servicio de email.';
                    } else if (emailError.text.includes('Invalid')) {
                        errorMessage += 'Configuración inválida.';
                    } else {
                        errorMessage += 'Error desconocido.';
                    }
                } else {
                    errorMessage += `
                        🔧 <strong>Error técnico detectado</strong><br><br>
                        
                        📧 <strong>Contáctame directamente por:</strong><br>
                        📧 Email: <a href="mailto:juan.juand.dev@gmail.com" style="color: #007bff;">juan.juand.dev@gmail.com</a><br>
                        📞 WhatsApp: <a href="https://wa.me/573115024430" target="_blank" style="color: #25d366;">+57 311 502 44 30</a><br>
                        💼 LinkedIn: <a href="https://www.linkedin.com/in/juan-david-mahecha-sabogal" target="_blank" style="color: #0077b5;">Juan David Mahecha</a>
                    `;
                }
                
                errorMessage += '<br><br>💡 <strong>¡Estaré encantado de escucharte!</strong>';
                this.showFormStatus('error', errorMessage);
            }
            
        } catch (error) {
            console.error('Error with contact form:', error);
            this.showFormStatus('error', '❌ Error al procesar el formulario. Para contactarme directamente: juan.juand.dev@gmail.com');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    showFormStatus(type, message) {
        const formStatus = document.getElementById('form-status');
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        formStatus.style.display = 'block';
        
        // Hide status after 8 seconds for info messages, 5 seconds for others
        const timeout = type === 'info' ? 8000 : 5000;
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }

    loadBestScores() {
        // Load and display best scores
        const snakeBest = localStorage.getItem('snakeBest') || 0;
        const memoryBest = localStorage.getItem('memoryBest') || null;
        const tetrisBest = localStorage.getItem('tetrisBest') || 0;
        const pongBest = localStorage.getItem('pongBest') || 0;

        document.getElementById('snake-best').textContent = snakeBest;
        document.getElementById('tetris-best').textContent = tetrisBest;
        document.getElementById('pong-best').textContent = pongBest;
        
        if (memoryBest) {
            const minutes = Math.floor(memoryBest / 60);
            const seconds = memoryBest % 60;
            document.getElementById('memory-best').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }
}

// ===== PHOTO GALLERY FUNCTIONALITY =====

class PhotoManager {
    constructor() {
        this.initPhotoEvents();
    }

    initPhotoEvents() {
        // Photo item clicks
        document.querySelectorAll('.photo-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const photoId = e.currentTarget.getAttribute('data-photo');
                this.openPhotoModal(photoId);
            });
        });

        // Modal close
        const closeBtn = document.querySelector('.photo-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closePhotoModal());
        }

        // Modal background click
        const modal = document.getElementById('photo-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closePhotoModal();
                }
            });
        }
    }

    openPhotoModal(photoId) {
        const modal = document.getElementById('photo-modal');
        const modalPhoto = document.getElementById('modal-photo');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');

        // Photo data with professional images
        const photoData = {
            'professional-1': {
                title: 'En Adidas Colombia',
                description: 'Durante mi tiempo como Trainee Developer en Adidas Colombia, trabajé en proyectos de web scraping y desarrollo de software.',
                src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face'
            },
            'professional-2': {
                title: 'Programando',
                description: 'Desarrollando soluciones en Python y trabajando en proyectos web fullstack.',
                src: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'
            },
            'professional-3': {
                title: 'Workspace',
                description: 'Mi setup de desarrollo con múltiples monitores y herramientas de programación.',
                src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
            },
            'professional-4': {
                title: 'Team Collaboration',
                description: 'Trabajando en equipo en proyectos de desarrollo de software y soluciones innovadoras.',
                src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop'
            },
            'professional-5': {
                title: 'Code Review',
                description: 'Revisando código y aplicando mejores prácticas en desarrollo web.',
                src: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
            },
            'professional-6': {
                title: 'Innovation Lab',
                description: 'Explorando nuevas tecnologías y metodologías de desarrollo.',
                src: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=600&fit=crop'
            }
        };

        const data = photoData[photoId] || {
            title: 'Foto',
            description: 'Descripción no disponible',
            src: 'assets/images/placeholder.jpg'
        };

        modalTitle.textContent = data.title;
        modalDescription.textContent = data.description;
        modalPhoto.src = data.src;
        modalPhoto.alt = data.title;

        modal.style.display = 'flex';
    }

    closePhotoModal() {
        document.getElementById('photo-modal').style.display = 'none';
    }
}

// ===== INITIALIZATION =====

let gameManager, contactManager, photoManager;

document.addEventListener('DOMContentLoaded', () => {
    gameManager = new GameManager();
    contactManager = new ContactManager();
    photoManager = new PhotoManager();
    
    // Make gameManager globally accessible
    window.gameManager = gameManager;
    console.log('GameManager initialized and made global');
});