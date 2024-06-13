let cards = [];
let drawnNumbers = new Set();

function generateCards() {
    const numCards = parseInt(document.getElementById('numCards').value, 10);
    cards = [];
    
    for (let i = 0; i < numCards; i++) {
        const card = generateCard();
        cards.push(card);
    }

    document.getElementById('generateCardsButton').disabled = true;
    document.getElementById('nextNumberButton').disabled = false;

    createBingoGrid();
    displayCards();
}
// Esta función crea una tarjeta de bingo. Cada tarjeta es un array de 3 filas,
// y cada fila es un array de 5 números aleatorios extraídos de los números disponibles.
function generateCard() {
    const card = [];
    const availableNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
    
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 5; j++) {
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            row.push(availableNumbers.splice(randomIndex, 1)[0]);
        }
        card.push(row);
    }
    return card;
}
// Esta función crea una cuadrícula de bingo en el DOM. La cuadrícula es un conjunto de 90 celdas,
// cada una representando un número del 1 al 90. Cada celda es un div con su id correspondiente.
function createBingoGrid() {
    const grid = document.getElementById('bingoGrid');
    grid.innerHTML = ''; // Clear previous grid

    for (let i = 1; i <= 90; i++) {
        const cell = document.createElement('div');
        cell.textContent = i;
        cell.id = 'cell-' + i;
        grid.appendChild(cell);
    }
}
// Función para mostrar las tarjetas en la interfaz de usuario.
// Cada tarjeta es un div que contiene una tabla.
// Cada fila de la tabla es creada a partir de los elementos de la tarjeta.
// Cada celda de la tabla contiene un número de la tarjeta.
function displayCards() {
    const cardsContainer = document.getElementById('cardsContainer');
    cardsContainer.innerHTML = ''; // Clear previous cards

    cards.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.dataset.cardIndex = index;
        const cardTable = document.createElement('table');
        
        card.forEach((row, rowIndex) => {
            const rowElement = document.createElement('tr');
            row.forEach((number, colIndex) => {
                const cell = document.createElement('td');
                cell.textContent = number;
                cell.id = `card-${index}-row-${rowIndex}-col-${colIndex}`;
                rowElement.appendChild(cell);
            });
            cardTable.appendChild(rowElement);
        });

        cardDiv.appendChild(cardTable);
        cardsContainer.appendChild(cardDiv);
    });
}

function generateNextNumber() {
    if (drawnNumbers.size >= 90) {
        alert('Todos los números han sido sorteados.');
        return;
    }

    let nextNumber;
    do {
        nextNumber = Math.floor(Math.random() * 90) + 1;
    } while (drawnNumbers.has(nextNumber));

    drawnNumbers.add(nextNumber);
    document.getElementById('cell-' + nextNumber).classList.add('active');
    markNumberInCards(nextNumber);
    checkForWinners();
}

function markNumberInCards(number) {
    cards.forEach((card, cardIndex) => {
        card.forEach((row, rowIndex) => {
            row.forEach((num, colIndex) => {
                if (num === number) {
                    row[colIndex] = null; // marca numero como encontrado
                    document.getElementById(`card-${cardIndex}-row-${rowIndex}-col-${colIndex}`).classList.add('marked');
                }
            });
        });
    });
}

function checkForWinners() {
    let lineWinner = null;
    let bingoWinner = null;

    cards.forEach(card => {
        card.forEach(row => {
            if (row.includes(null) && row.every(num => num === null)) {
                lineWinner = card;
            }
        });

        if (card.flat().every(num => num === null)) {
            bingoWinner = card;
        }
    });

    if (lineWinner) {
        document.getElementById('results').textContent = '¡Línea completa!';
        console.log('Cartón ganador de línea:', lineWinner);
    }

    if (bingoWinner) {
        document.getElementById('results').textContent = '¡Bingo!';
        console.log('Cartón ganador de bingo:', bingoWinner);
    }
}
