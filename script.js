const wordList = [
    'gold', 'luck', 'clover', 'rain', 'charm', 'parade',
    'leprechaun', 'treasure', 'celebration', 'greenery',
    'shenanigans', 'tradition'
];

// Setting Game Variables
let selectedWord = '';
let displayedWord = '';
let wrongGuess = 0;
let guessedLetters = [];
const maxMistakes = 6;

function startGame(level) {
    selectedWord = getRandomWord(level);
    guessedLetters = [];
    wrongGuess = 0;

    // Update difficulty display div
    updateDifficultyDisplay(level);

    // Create the placeholder for the selected word
    displayedWord = '_'.repeat(selectedWord.length);
    document.getElementById('wordDisplay').textContent = displayedWord.split('').join(' ');

    // Toggle visibility
    document.getElementById('difficultySelection').classList.add('d-none');
    document.getElementById('difficultyBox').classList.remove('d-none');
    document.getElementById('gameArea').classList.remove('d-none');
    document.getElementById('gameArea').classList.add('d-block');
    document.getElementById('difficultyBox').classList.add('d-block');
}

function getRandomWord(level) {
    let filteredWords = wordList.filter(word => {
        if (level === 'easy') return word.length <= 4;
        if (level === 'medium') return word.length >= 5 && word.length <= 7;
        if (level === 'hard') return word.length >= 8;
    });
    return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

function updateDifficultyDisplay(level) {
    let difficultyBox = document.getElementById('difficultyBox');
    difficultyBox.classList.remove('easy', 'medium', 'hard');
    difficultyBox.textContent = `Difficulty: ${level.charAt(0).toUpperCase() + level.slice(1)}`;
    difficultyBox.classList.add(level);
}

function guessLetter() {
    const input = document.getElementById('letterInput');
    const guess = input.value.toLowerCase();

    if (!guess || guessedLetters.includes(guess) || guess.length !== 1) {
        input.value = '';
        return;
    }

    guessedLetters.push(guess);

    let updatedWord = '';
    for (let i = 0; i < selectedWord.length; i++) {
        updatedWord += guessedLetters.includes(selectedWord[i]) ? selectedWord[i] : '_';
    }

    displayedWord = updatedWord;
    document.getElementById('wordDisplay').textContent = displayedWord.split('').join(' ');

    if (!selectedWord.includes(guess)) {
        wrongGuess++;
    }

    if (displayedWord === selectedWord) {
        alert('You won!');
    }

    if (wrongGuess >= maxMistakes) {
        alert(`Game over! The word was "${selectedWord}".`);
    }

    input.value = '';
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('letterInput').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            guessLetter();
        }
    });
});