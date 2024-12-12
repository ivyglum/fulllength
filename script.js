const puzzleContainer = document.getElementById('puzzle-container');
const nextButton = document.getElementById('next-button');
const screamAudio = document.getElementById('scream-audio');
const screamer = document.getElementById('screamer');

const puzzleImages = [
    'assets/puzzle1.jpg', // Imagen del primer rompecabezas
    'assets/puzzle2.jpg', // Imagen del segundo rompecabezas
    'assets/puzzle3.jpg', // Imagen del tercer rompecabezas
];

let currentPuzzleIndex = 0;

function loadPuzzle(index) {
    puzzleContainer.innerHTML = ''; // Limpiar rompecabezas previo
    const pieces = Array.from({ length: 9 }, (_, i) => i);
    pieces.sort(() => Math.random() - 0.5); // Mezclar las piezas

    pieces.forEach(pieceIndex => {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundImage = `url('${puzzleImages[index]}')`;
        piece.style.backgroundPosition = `-${(pieceIndex % 3) * 80}px -${Math.floor(pieceIndex / 3) * 80}px`;
        piece.draggable = true;
        puzzleContainer.appendChild(piece);
    });

    // Habilitar arrastrar y soltar
    enableDragAndDrop();
}

function enableDragAndDrop() {
    let draggedPiece = null;

    puzzleContainer.addEventListener('dragstart', (event) => {
        draggedPiece = event.target;
    });

    puzzleContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    puzzleContainer.addEventListener('drop', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('piece') && draggedPiece !== event.target) {
            const draggedIndex = Array.from(puzzleContainer.children).indexOf(draggedPiece);
            const targetIndex = Array.from(puzzleContainer.children).indexOf(event.target);

            // Intercambiar las piezas
            if (draggedIndex !== targetIndex) {
                puzzleContainer.insertBefore(draggedPiece, targetIndex > draggedIndex ? event.target.nextSibling : event.target);
                puzzleContainer.insertBefore(event.target, draggedPiece);
            }
        }
    });
}

function checkPuzzleCompletion() {
    const pieces = Array.from(puzzleContainer.children);
    const isCorrect = pieces.every((piece, index) => {
        const bgPosition = piece.style.backgroundPosition;
        const expectedPosition = `-${(index % 3) * 80}px -${Math.floor(index / 3) * 80}px`;
        return bgPosition === expectedPosition;
    });

    if (isCorrect) {
        nextButton.classList.remove('hidden');
    }
}

puzzleContainer.addEventListener('drop', checkPuzzleCompletion);

nextButton.addEventListener('click', () => {
    if (currentPuzzleIndex < puzzleImages.length - 1) {
        currentPuzzleIndex++;
        loadPuzzle(currentPuzzleIndex);
        nextButton.classList.add('hidden');

        // Activar screamer en el último rompecabezas
        if (currentPuzzleIndex === puzzleImages.length - 1) {
            setTimeout(() => {
                screamAudio.play();
                screamer.classList.remove('hidden');
                document.body.style.backgroundColor = 'red';
                document.querySelector('h1').classList.add('hidden');
                document.querySelector('p').classList.add('hidden');
                puzzleContainer.classList.add('hidden');
            }, 20000);
        }
    }
});

// Cargar el primer rompecabezas
loadPuzzle(currentPuzzleIndex);
