const symbols = ["🐧", "🦊", "🐻", "🐼", "🦉", "🐸"];
const grid = document.querySelector("#card-grid");
const movesDisplay = document.querySelector("#moves");
const timerDisplay = document.querySelector("#timer");
const message = document.querySelector("#game-message");
const restartButton = document.querySelector("#restart");

let firstCard = null;
let locked = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerId = null;
let mismatchTimeout = null;

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
}

function startTimer() {
    if (timerId !== null) {
        return;
    }

    timerId = window.setInterval(() => {
        seconds += 1;
        timerDisplay.textContent = formatTime(seconds);
    }, 1000);
}

function shuffle(cards) {
    for (let index = cards.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [cards[index], cards[randomIndex]] = [cards[randomIndex], cards[index]];
    }

    return cards;
}

function createCard(symbol, index) {
    const card = document.createElement("button");
    card.className = "memory-card";
    card.type = "button";
    card.dataset.symbol = symbol;
    card.setAttribute("aria-label", `Carta ${index + 1}, oculta`);
    card.textContent = "?";
    card.addEventListener("click", () => revealCard(card));
    return card;
}

function setCardVisible(card, visible) {
    const symbol = card.dataset.symbol;
    card.classList.toggle("is-revealed", visible);
    card.textContent = visible ? symbol : "?";
    card.setAttribute(
        "aria-label",
        visible ? `Carta: ${symbol}` : "Carta oculta"
    );
}

function revealCard(card) {
    if (locked || card.classList.contains("is-revealed") || card.classList.contains("is-matched")) {
        return;
    }

    startTimer();
    setCardVisible(card, true);

    if (firstCard === null) {
        firstCard = card;
        message.textContent = "Elige otra carta para buscar su pareja.";
        return;
    }

    moves += 1;
    movesDisplay.textContent = moves.toString();

    if (firstCard.dataset.symbol === card.dataset.symbol) {
        firstCard.classList.add("is-matched");
        card.classList.add("is-matched");
        firstCard.setAttribute("aria-label", `Pareja encontrada: ${card.dataset.symbol}`);
        card.setAttribute("aria-label", `Pareja encontrada: ${card.dataset.symbol}`);
        firstCard = null;
        matchedPairs += 1;

        if (matchedPairs === symbols.length) {
            window.clearInterval(timerId);
            timerId = null;
            message.textContent = `¡Ganaste! Encontraste todas las parejas en ${moves} movimientos y ${formatTime(seconds)}.`;
        } else {
            message.textContent = "¡Encontraste una pareja! Sigue buscando.";
        }

        return;
    }

    locked = true;
    message.textContent = "No coinciden. Inténtalo de nuevo.";
    const previousCard = firstCard;
    firstCard = null;

    mismatchTimeout = window.setTimeout(() => {
        setCardVisible(previousCard, false);
        setCardVisible(card, false);
        locked = false;
        mismatchTimeout = null;
        message.textContent = "Elige una carta para continuar.";
    }, 850);
}

function startNewGame() {
    if (timerId !== null) {
        window.clearInterval(timerId);
        timerId = null;
    }

    if (mismatchTimeout !== null) {
        window.clearTimeout(mismatchTimeout);
        mismatchTimeout = null;
    }

    firstCard = null;
    locked = false;
    moves = 0;
    matchedPairs = 0;
    seconds = 0;
    movesDisplay.textContent = "0";
    timerDisplay.textContent = "00:00";
    message.textContent = "Elige una carta para comenzar.";

    const cards = shuffle([...symbols, ...symbols]);
    grid.replaceChildren(...cards.map(createCard));
}

restartButton.addEventListener("click", startNewGame);
startNewGame();
