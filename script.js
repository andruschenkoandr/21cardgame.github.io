document.addEventListener("DOMContentLoaded", function () {
    const playerNameElement = document.getElementById("player-name");
    const playerTitleElement = document.getElementById("player-title");
    const playerScoreElement = document.getElementById("player-score");
    const computerScoreElement = document.getElementById("computer-score");
    const roundNumberElement = document.getElementById("round-number");

    const playerCardSlot = document.getElementById("player-card-slot");
    const computerCardSlot = document.getElementById("computer-card-slot");
    const playerCardPoints = document.getElementById("player-card-points");
    const computerCardPoints = document.getElementById("computer-card-points");
    const gameMessage = document.getElementById("game-message");

    const drawButton = document.getElementById("draw-button");
    const restartButton = document.getElementById("restart-button");

    const TOTAL_ROUNDS = 3;

    const cards = [
        { name: "6", value: 6, rank: "6" },
        { name: "7", value: 7, rank: "7" },
        { name: "8", value: 8, rank: "8" },
        { name: "9", value: 9, rank: "9" },
        { name: "10", value: 10, rank: "0" },
        { name: "Валет", value: 2, rank: "J" },
        { name: "Дама", value: 3, rank: "Q" },
        { name: "Король", value: 4, rank: "K" },
        { name: "Туз", value: 11, rank: "A" }
    ];

    const suits = [
        { symbol: "♥", code: "H" },
        { symbol: "♦", code: "D" },
        { symbol: "♣", code: "C" },
        { symbol: "♠", code: "S" }
    ];

    let playerName = "Гравець";
    let playerScore = 0;
    let computerScore = 0;
    let currentRound = 0;
    let gameFinished = false;

    function askPlayerName() {
        const enteredName = prompt("Введи своє ім'я:");

        if (enteredName && enteredName.trim() !== "") {
            playerName = enteredName.trim();
        }

        playerNameElement.textContent = playerName;
        playerTitleElement.textContent = "Карта " + playerName;
    }

    function getRandomCard() {
        const card = cards[Math.floor(Math.random() * cards.length)];
        const suit = suits[Math.floor(Math.random() * suits.length)];

        return {
            name: card.name,
            value: card.value,
            symbol: suit.symbol,
            image: "https://deckofcardsapi.com/static/img/" +
                card.rank + suit.code + ".png"
        };
    }

    function createCardElement(card) {
        const image = document.createElement("img");

        image.className = "playing-card";
        image.src = card.image;
        image.alt = card.name + " " + card.symbol;
        image.title = card.name + " — " + card.value + " очок";

        image.onerror = function () {
            const placeholder = document.createElement("div");

            placeholder.className = "card-placeholder";
            placeholder.textContent = card.symbol;
            image.replaceWith(placeholder);
        };

        return image;
    }

    function displayCard(slot, pointsElement, card) {
        slot.replaceChildren(createCardElement(card));
        pointsElement.textContent = card.name + ": " + card.value + " очок";
    }

    function updateScoreboard() {
        playerScoreElement.textContent = playerScore;
        computerScoreElement.textContent = computerScore;

        const displayedRound = Math.min(currentRound + 1, TOTAL_ROUNDS);
        roundNumberElement.textContent =
            displayedRound + " / " + TOTAL_ROUNDS;
    }

    function drawCards() {
        if (gameFinished) {
            return;
        }

        const playerCard = getRandomCard();
        const computerCard = getRandomCard();

        displayCard(playerCardSlot, playerCardPoints, playerCard);
        displayCard(computerCardSlot, computerCardPoints, computerCard);

        playerScore += playerCard.value;
        computerScore += computerCard.value;
        currentRound++;

        if (playerCard.value > computerCard.value) {
            gameMessage.textContent =
                playerName + " виграв раунд! +" + playerCard.value + " очок.";
        } else if (computerCard.value > playerCard.value) {
            gameMessage.textContent =
                "Комп'ютер виграв раунд! +" + computerCard.value + " очок.";
        } else {
            gameMessage.textContent = "Нічия за значенням карт!";
        }

        updateScoreboard();

        if (currentRound === TOTAL_ROUNDS) {
            finishGame();
        } else {
            drawButton.textContent = "Наступний раунд";
        }
    }

    function finishGame() {
        gameFinished = true;
        drawButton.disabled = true;

        if (playerScore > computerScore) {
            gameMessage.textContent =
                "Гру завершено! Переміг " + playerName + " — " +
                playerScore + ":" + computerScore + ".";
        } else if (computerScore > playerScore) {
            gameMessage.textContent =
                "Гру завершено! Переміг комп'ютер — " +
                computerScore + ":" + playerScore + ".";
        } else {
            gameMessage.textContent =
                "Гру завершено! Нічия — " +
                playerScore + ":" + computerScore + ".";
        }
    }

    function restartGame() {
        playerScore = 0;
        computerScore = 0;
        currentRound = 0;
        gameFinished = false;

        playerCardSlot.replaceChildren();
        computerCardSlot.replaceChildren();

        const playerPlaceholder = document.createElement("div");
        playerPlaceholder.className = "card-placeholder";
        playerPlaceholder.textContent = "?";

        const computerPlaceholder = document.createElement("div");
        computerPlaceholder.className = "card-placeholder";
        computerPlaceholder.textContent = "?";

        playerCardSlot.appendChild(playerPlaceholder);
        computerCardSlot.appendChild(computerPlaceholder);

        playerCardPoints.textContent = "Очікування карти";
        computerCardPoints.textContent = "Очікування карти";
        gameMessage.textContent = "Натисни кнопку, щоб почати гру.";

        drawButton.disabled = false;
        drawButton.textContent = "Витягнути карти";

        updateScoreboard();
    }

    drawButton.addEventListener("click", drawCards);
    restartButton.addEventListener("click", restartGame);

    askPlayerName();
    updateScoreboard();
});