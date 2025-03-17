document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const startGameBtn = document.getElementById('start-game');
    const resetGameBtn = document.getElementById('reset-game');
    const playAgainBtn = document.getElementById('play-again');
    const pairsCountInput = document.getElementById('pairs-count');
    const gameBoard = document.getElementById('game-board');
    const movesElement = document.getElementById('moves');
    const timeElement = document.getElementById('time');
    const finalTimeElement = document.getElementById('final-time');
    const finalMovesElement = document.getElementById('final-moves');
    const winMessage = document.getElementById('win-message');

    // Make sure win message is hidden on page load
    winMessage.style.display = 'none';
    winMessage.style.pointerEvents = 'none';
    winMessage.classList.add('hidden');

    // Game state variables
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let totalPairs = 6; // Default value
    let moves = 0;
    let gameStarted = false;
    let timer = null;
    let seconds = 0;
    let canFlip = true;

    // Initialize the page
    initializePage();

    // Clock times to use for the game
    const clockTimes = [
        { time: "1:00", hour: 1, minute: 0 },
        { time: "2:00", hour: 2, minute: 0 },
        { time: "3:00", hour: 3, minute: 0 },
        { time: "4:00", hour: 4, minute: 0 },
        { time: "5:00", hour: 5, minute: 0 },
        { time: "6:00", hour: 6, minute: 0 },
        { time: "7:00", hour: 7, minute: 0 },
        { time: "8:00", hour: 8, minute: 0 },
        { time: "9:00", hour: 9, minute: 0 },
        { time: "10:00", hour: 10, minute: 0 },
        { time: "11:00", hour: 11, minute: 0 },
        { time: "12:00", hour: 12, minute: 0 },
        { time: "1:30", hour: 1, minute: 30 },
        { time: "2:30", hour: 2, minute: 30 },
        { time: "3:30", hour: 3, minute: 30 },
        { time: "4:30", hour: 4, minute: 30 },
        { time: "5:30", hour: 5, minute: 30 },
        { time: "6:30", hour: 6, minute: 30 },
        { time: "7:30", hour: 7, minute: 30 },
        { time: "8:30", hour: 8, minute: 30 },
        { time: "9:30", hour: 9, minute: 30 },
        { time: "10:30", hour: 10, minute: 30 },
        { time: "11:30", hour: 11, minute: 30 },
        { time: "12:30", hour: 12, minute: 30 }
    ];

    // Event listeners - make sure they're working
    startGameBtn.onclick = startGame;
    resetGameBtn.onclick = resetGame;
    playAgainBtn.onclick = resetGame;

    // Initialize the page
    function initializePage() {
        // Make sure game is in reset state
        stopTimer();
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        canFlip = true;
        gameStarted = false;
        updateMoves();
        updateTimer();
        
        // Make sure win message is hidden
        winMessage.style.display = 'none';
        winMessage.style.pointerEvents = 'none';
        winMessage.classList.add('hidden');
        
        console.log('Game initialized');
    }

    // Initialize the game
    function startGame() {
        totalPairs = parseInt(pairsCountInput.value);
        
        if (isNaN(totalPairs) || totalPairs < 2 || totalPairs > 12) {
            alert('Please enter a number between 2 and 12');
            return;
        }

        resetGame();
        createGameBoard();
        startTimer();
        gameStarted = true;
    }

    // Reset the game
    function resetGame() {
        stopTimer();
        gameBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        seconds = 0;
        canFlip = true;
        gameStarted = false;
        updateMoves();
        updateTimer();
        winMessage.style.display = 'none';
        winMessage.style.pointerEvents = 'none';
        winMessage.classList.add('hidden');
    }

    // Create the game board
    function createGameBoard() {
        // Shuffle and select the required number of clock times
        const shuffledTimes = [...clockTimes].sort(() => 0.5 - Math.random()).slice(0, totalPairs);
        
        // Create pairs (clock image and text)
        cards = [];
        shuffledTimes.forEach(clockTime => {
            // Create clock image card
            cards.push({
                type: 'image',
                time: clockTime.time,
                hour: clockTime.hour,
                minute: clockTime.minute
            });
            
            // Create clock text card
            cards.push({
                type: 'text',
                time: clockTime.time,
                hour: clockTime.hour,
                minute: clockTime.minute
            });
        });
        
        // Shuffle the cards
        cards = shuffleArray(cards);
        
        // Set grid columns based on number of pairs
        const columns = totalPairs <= 4 ? 4 : (totalPairs <= 8 ? 6 : 8);
        gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        
        // Create card elements
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.index = index;
            
            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');
            
            const cardFront = document.createElement('div');
            cardFront.classList.add('card-front');
            
            if (card.type === 'image') {
                cardFront.appendChild(createClockImage(card.hour, card.minute));
            } else {
                const textElement = document.createElement('div');
                textElement.classList.add('clock-text');
                textElement.textContent = card.time;
                cardFront.appendChild(textElement);
            }
            
            const cardBack = document.createElement('div');
            cardBack.classList.add('card-back');
            
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);
            
            cardElement.addEventListener('click', () => flipCard(index));
            gameBoard.appendChild(cardElement);
        });
    }

    // Create SVG clock image
    function createClockImage(hour, minute) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "100");
        svg.setAttribute("height", "100");
        svg.setAttribute("viewBox", "0 0 100 100");
        svg.classList.add("clock-image");
        
        // Clock face
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", "50");
        circle.setAttribute("cy", "50");
        circle.setAttribute("r", "45");
        circle.setAttribute("fill", "white");
        circle.setAttribute("stroke", "#333");
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);
        
        // Hour markers
        for (let i = 0; i < 12; i++) {
            const marker = document.createElementNS("http://www.w3.org/2000/svg", "line");
            const angle = i * 30 * Math.PI / 180;
            const x1 = 50 + 38 * Math.sin(angle);
            const y1 = 50 - 38 * Math.cos(angle);
            const x2 = 50 + 42 * Math.sin(angle);
            const y2 = 50 - 42 * Math.cos(angle);
            
            marker.setAttribute("x1", x1);
            marker.setAttribute("y1", y1);
            marker.setAttribute("x2", x2);
            marker.setAttribute("y2", y2);
            marker.setAttribute("stroke", "#333");
            marker.setAttribute("stroke-width", "2");
            svg.appendChild(marker);
            
            // Add hour numbers
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            const hourNum = i === 0 ? 12 : i;
            const textX = 50 + 32 * Math.sin(angle);
            const textY = 50 - 32 * Math.cos(angle);
            
            text.setAttribute("x", textX);
            text.setAttribute("y", textY);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("dominant-baseline", "middle");
            text.setAttribute("font-size", "10");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("fill", "#333");
            text.textContent = hourNum;
            svg.appendChild(text);
        }
        
        // Hour hand
        const hourAngle = ((hour % 12) * 30 + minute * 0.5) * Math.PI / 180;
        const hourHand = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hourHand.setAttribute("x1", "50");
        hourHand.setAttribute("y1", "50");
        hourHand.setAttribute("x2", 50 + 25 * Math.sin(hourAngle));
        hourHand.setAttribute("y2", 50 - 25 * Math.cos(hourAngle));
        hourHand.setAttribute("stroke", "#333");
        hourHand.setAttribute("stroke-width", "4");
        hourHand.setAttribute("stroke-linecap", "round");
        svg.appendChild(hourHand);
        
        // Minute hand
        const minuteAngle = minute * 6 * Math.PI / 180;
        const minuteHand = document.createElementNS("http://www.w3.org/2000/svg", "line");
        minuteHand.setAttribute("x1", "50");
        minuteHand.setAttribute("y1", "50");
        minuteHand.setAttribute("x2", 50 + 35 * Math.sin(minuteAngle));
        minuteHand.setAttribute("y2", 50 - 35 * Math.cos(minuteAngle));
        minuteHand.setAttribute("stroke", "#333");
        minuteHand.setAttribute("stroke-width", "2");
        minuteHand.setAttribute("stroke-linecap", "round");
        svg.appendChild(minuteHand);
        
        // Center dot
        const centerDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        centerDot.setAttribute("cx", "50");
        centerDot.setAttribute("cy", "50");
        centerDot.setAttribute("r", "3");
        centerDot.setAttribute("fill", "#333");
        svg.appendChild(centerDot);
        
        return svg;
    }

    // Flip a card
    function flipCard(index) {
        if (!gameStarted || !canFlip) return;
        
        const cardElement = document.querySelector(`.card[data-index="${index}"]`);
        
        // Check if card is already flipped or matched
        if (flippedCards.includes(index) || cardElement.classList.contains('matched')) {
            return;
        }
        
        // Flip the card
        cardElement.classList.add('flipped');
        flippedCards.push(index);
        
        // Check if two cards are flipped
        if (flippedCards.length === 2) {
            moves++;
            updateMoves();
            canFlip = false;
            
            const firstCardIndex = flippedCards[0];
            const secondCardIndex = flippedCards[1];
            
            // Check if cards match
            if (cards[firstCardIndex].time === cards[secondCardIndex].time) {
                // Cards match
                setTimeout(() => {
                    document.querySelector(`.card[data-index="${firstCardIndex}"]`).classList.add('matched');
                    document.querySelector(`.card[data-index="${secondCardIndex}"]`).classList.add('matched');
                    flippedCards = [];
                    matchedPairs++;
                    canFlip = true;
                    
                    // Check if all pairs are matched
                    if (matchedPairs === totalPairs) {
                        gameWon();
                    }
                }, 500);
            } else {
                // Cards don't match
                setTimeout(() => {
                    document.querySelector(`.card[data-index="${firstCardIndex}"]`).classList.remove('flipped');
                    document.querySelector(`.card[data-index="${secondCardIndex}"]`).classList.remove('flipped');
                    flippedCards = [];
                    canFlip = true;
                }, 1000);
            }
        }
    }

    // Game won
    function gameWon() {
        // Only show win message if the game has actually started
        if (!gameStarted) {
            console.log('Game not started, not showing win message');
            return;
        }
        
        stopTimer();
        finalTimeElement.textContent = timeElement.textContent;
        finalMovesElement.textContent = moves;
        
        console.log('Game won! Showing win message');
        
        setTimeout(() => {
            winMessage.style.display = 'flex';
            winMessage.style.pointerEvents = 'auto';
            winMessage.classList.remove('hidden');
        }, 500);
    }

    // Start the timer
    function startTimer() {
        stopTimer();
        seconds = 0;
        updateTimer();
        timer = setInterval(() => {
            seconds++;
            updateTimer();
        }, 1000);
    }

    // Stop the timer
    function stopTimer() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    // Update the timer display
    function updateTimer() {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Update the moves display
    function updateMoves() {
        movesElement.textContent = moves;
    }

    // Shuffle array (Fisher-Yates algorithm)
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
}); 