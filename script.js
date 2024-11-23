document.addEventListener('DOMContentLoaded', function() {
    const gameChoice = document.getElementById('game-choice');
    const snakeContainer = document.getElementById('snake-container');
    const unoContainer = document.getElementById('uno-container');

    // Snake game variables and functions
    const snakeCanvas = document.getElementById('snake-board');
    const snakeCtx = snakeCanvas.getContext('2d');
    const snakeScoreElement = document.getElementById('snake-score-value');

    const gridSize = 20;
    const tileCount = 20;
    snakeCanvas.width = gridSize * tileCount;
    snakeCanvas.height = gridSize * tileCount;

    let snake, food, dx, dy, score, snakeGameInterval;

    function initSnakeGame() {
        snake = [{ x: 10, y: 10 }];
        food = getRandomFood();
        dx = 0;
        dy = 0;
        score = 0;
        if (snakeGameInterval) clearInterval(snakeGameInterval);
        snakeGameInterval = setInterval(moveSnake, 200); // Adjusted speed
        drawSnakeGame();
    }

    function getRandomFood() {
        return {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
    }

    function drawSnakeGame() {
        snakeCtx.fillStyle = 'black'; // Background color
        snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

        snakeCtx.fillStyle = 'blue'; // Snake color
        snake.forEach(segment => {
            snakeCtx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
        });

        snakeCtx.fillStyle = 'yellow'; // Food color
        snakeCtx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);

        snakeScoreElement.textContent = score;
        requestAnimationFrame(drawSnakeGame);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            food = getRandomFood();
        } else {
            snake.pop();
        }
        checkSnakeCollision();
    }

    function checkSnakeCollision() {
        const head = snake[0];
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
        }
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                gameOver();
            }
        }
    }

    function gameOver() {
        clearInterval(snakeGameInterval);
        alert('Game Over! Your score: ' + score);
        initSnakeGame();
    }

    function changeDirection(newDx, newDy) {
        const goingUp = dy === -1;
        const goingDown = dy === 1;
        const goingRight = dx === 1;
        const goingLeft = dx === -1;

        if (newDx === -1 && !goingRight) {
            dx = -1;
            dy = 0;
        }
        if (newDy === -1 && !goingDown) {
            dx = 0;
            dy = -1;
        }
        if (newDx === 1 && !goingLeft) {
            dx = 1;
            dy = 0;
        }
        if (newDy === 1 && !goingUp) {
            dx = 0;
            dy = 1;
        }
    }

    // Button event listeners
    document.getElementById('left-btn').addEventListener('click', () => changeDirection(-1, 0));
    document.getElementById('up-btn').addEventListener('click', () => changeDirection(0, -1));
    document.getElementById('down-btn').addEventListener('click', () => changeDirection(0, 1));
    document.getElementById('right-btn').addEventListener('click', () => changeDirection(1, 0));

    // Keyboard event listeners
    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'ArrowLeft':
                changeDirection(-1, 0);
                break;
            case 'ArrowUp':
                changeDirection(0, -1);
                break;
            case 'ArrowDown':
                changeDirection(0, 1);
                break;
            case 'ArrowRight':
                changeDirection(1, 0);
                break;
        }
    });

    // Uno game variables and functions
    const colors = ['red', 'blue', 'green', 'yellow'];
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let deck, playerHand, opponentHand, discardPile;

    function initUnoGame() {
        deck = createDeck();
        shuffleDeck(deck);
        playerHand = dealCards(7);
        opponentHand = dealCards(7);
        discardPile = [dealCards(1)[0]];
        renderUnoGame();

        const drawCardButton = document.getElementById('draw-card');
        if (drawCardButton) {
            drawCardButton.onclick = () => {
                if (deck.length > 0) {
                    playerHand.push(dealCards(1)[0]);
                    renderUnoGame();
                    setTimeout(opponentTurn, 1000);
                } else {
                    alert("No more cards in the deck! Reshuffling...");
                    reshuffleDeck();
                }
            };
        }
    }

    function createDeck() {
        const deck = [];
        for (const color of colors) {
            for (const number of numbers) {
                deck.push({ color, number });
            }
        }
        return deck;
    }

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    function dealCards(count) {
        return deck.splice(0, count);
    }

    function reshuffleDeck() {
        // Reshuffle the discard pile into the deck
        if (discardPile.length > 0) {
            deck = deck.concat(discardPile.slice(0, discardPile.length - 1)); // Keep the top card
            shuffleDeck(deck);
            discardPile = [discardPile[discardPile.length - 1]]; // Reset discard pile with the top card
            alert("Deck reshuffled!");
        }
    }

    function renderUnoGame() {
        renderHand(playerHand, 'player-hand', true);
        renderOpponentHand();
        renderDiscardPile();
    }

    function renderHand(hand, containerId, isPlayer) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        hand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.style.backgroundColor = card.color;
            cardElement.textContent = card.number;
            if (isPlayer) {
                cardElement.onclick = () => playCard(index);
            }
            container.appendChild(cardElement);
        });
    }

    function renderOpponentHand() {
        const container = document.getElementById('opponent-hand');
        if (!container) return;
        container.innerHTML = '';
        opponentHand.forEach(() => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.style.backgroundColor = 'gray';
            cardElement.textContent = '?';
            container.appendChild(cardElement);
        });
    }

    function renderDiscardPile() {
        const container = document.getElementById('discard-pile');
        if (!container) return;
        container.innerHTML = '';
        const topCard = discardPile[discardPile.length - 1];
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.style.backgroundColor = topCard.color;
        cardElement.textContent = topCard.number;
        container.appendChild(cardElement);
    }

    function playCard(index) {
        const card = playerHand[index];
        const topCard = discardPile[discardPile.length - 1];
        if (card.color === topCard.color || card.number === topCard.number) {
            discardPile.push(playerHand.splice(index, 1)[0]);
            renderUnoGame();
            if (playerHand.length === 0) {
                setTimeout(() => {
                    alert("Congratulations! You win!");
                    initUnoGame();
                }, 100);
            } else {
                setTimeout(opponentTurn, 1000);
            }
        } else {
            alert('Invalid move. The card must match the color or number of the top card on the discard pile.');
        }
    }

    function opponentTurn() {
        const topCard = discardPile[discardPile.length - 1];
        const playableCard = opponentHand.find(card => card.color === topCard.color || card.number === topCard.number);
        if (playableCard) {
            const index = opponentHand.indexOf(playableCard);
            discardPile.push(opponentHand.splice(index, 1)[0]);
        } else if (deck.length > 0) {
            opponentHand.push(dealCards(1)[0]);
        }
        renderUnoGame();
        if (opponentHand.length === 0) {
            setTimeout(() => {
                alert("Sorry, you lose. The computer wins!");
                initUnoGame();
            }, 100);
        }
    }

    gameChoice.addEventListener('change', function() {
        if (this.value === 'snake') {
            snakeContainer.style.display = 'block';
            unoContainer.style.display = 'none';
            initSnakeGame();
        } else if (this.value === 'uno') {
            snakeContainer.style.display = 'none';
            unoContainer.style.display = 'block';
            initUnoGame();
        } else {
            snakeContainer.style.display = 'none';
            unoContainer.style.display = 'none';
        }
    });
});
