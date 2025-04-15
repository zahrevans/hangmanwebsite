// List of words for the game
const wordList = [
    'gold',
    'luck',
    'clover',
    'rain',
    'charm',
    'parade',
    'leprechaun',
    'treasure',
    'celebration',
    'greenery',
    'shenanigans',
    'tradition'
]

// Set up the basic stuff we need
let selectedWord = '' // the word player needs to guess
let displayedWord = '' // shows _ _ _ for unguessed letters
let wrongGuesses = 0 // counts wrong guesses
let guessedLetters = [] // keeps track of letters already guessed
const maxMistakes = 6 // player loses after 6 wrong guesses
let wins = 0 // track wins
let losses = 0 // track losses

// A function that updates score display
function updateScoreDisplay() {
    document.querySelector('.wins').textContent = `Wins: ${wins}`
    document.querySelector('.losses').textContent = `Losses: ${losses}`
}

// This starts the game when you pick a difficulty
function startGame(level) {
    // Reset everything to start fresh
    wrongGuesses = 0
    guessedLetters = []
    document.getElementById('livesImage').src = 'img/6-gold-coins.jpeg'

    // Pick a random word based on difficulty
    selectedWord = getRandomWord(level)
    // Make the display show _ for each letter
    displayedWord = '_'.repeat(selectedWord.length)

    // Update the screen
    updateDifficultyDisplay(level)
    updateUI()
    
    // Show/hide the right stuff on screen
    document.getElementById('gameArea').classList.remove('d-none')
    document.getElementById('gameArea').classList.add('d-block')
    document.getElementById('difficultyBox').classList.remove('d-none')
    document.getElementById('difficultyBox').classList.add('d-block')
    document.getElementById('difficultySelection').classList.add('d-none')
    
    // Make the input box ready to type
    document.getElementById('letterInput').focus()
}

// Pick a random word based on how hard you want it
function getRandomWord(level) {
    let filteredWords = wordList.filter(word => {
        if (level === 'easy') return word.length <= 4 // short words
        if (level === 'medium') return word.length >= 5 && word.length <= 7 // medium words
        if (level === 'hard') return word.length >= 8 // long words
    })
    return filteredWords[Math.floor(Math.random() * filteredWords.length)]
}

// Show how hard the game is
function updateDifficultyDisplay(level) {
    let difficultyBox = document.getElementById('difficultyBox')
    difficultyBox.classList.remove('easy', 'medium', 'hard')

    // Add the right color and emoji
    if (level === 'easy') {
        difficultyBox.textContent = 'Difficulty: Easy 🍀'
        difficultyBox.classList.add('easy')
    } else if (level === 'medium') {
        difficultyBox.textContent = 'Difficulty: Medium 🌟'
        difficultyBox.classList.add('medium')
    } else if (level === 'hard') {
        difficultyBox.textContent = 'Difficulty: Hard 💀'
        difficultyBox.classList.add('hard')
    }
}

// Update what's shown on screen
function updateUI() {
    document.getElementById('wordDisplay').textContent = displayedWord.split('').join('  ')
}

// Start over
function restartGame() {
    // Clear everything
    document.getElementById('wordDisplay').textContent = ''
    document.getElementById('wrongLetters').textContent = ''

    // Remove any alert messages
    const alerts = document.querySelectorAll('.alert')
    alerts.forEach(alert => alert.remove())

    // Show/hide the right stuff
    document.getElementById('difficultySelection').classList.remove('d-none')
    document.getElementById('difficultySelection').classList.add('d-block')
    document.getElementById('gameArea').classList.remove('d-block')
    document.getElementById('gameArea').classList.add('d-none')
    document.getElementById('difficultyBox').classList.remove('d-block')
    document.getElementById('difficultyBox').classList.add('d-none')
}

// When player guesses a letter
function guessLetter() {
    let inputField = document.getElementById('letterInput')
    let guessedLetter = inputField.value.toLowerCase()

    // Make sure it's a real letter
    if (!guessedLetter.match(/^[a-z]$/)) {
        alert('Please enter a valid letter (A-Z)!')
        inputField.value = ''
        return
    }

    // Check if letter was already used
    if (guessedLetters.includes(guessedLetter)) {
        alert(`You already guessed '${guessedLetter}'. Try a different letter!`)
        inputField.value = ''
        return
    }

    // Add letter to used letters list
    guessedLetters.push(guessedLetter)

    // Check if guess was right or wrong
    if (selectedWord.includes(guessedLetter)) {
        updateCorrectGuess(guessedLetter)
    } else {
        updateWrongGuess(guessedLetter)
    }

    // Clear and focus input box
    inputField.value = ''
    document.getElementById('letterInput').focus()
}

// Handle wrong guesses
function updateWrongGuess(guessedLetter) {
    const wrongSound = new Audio('Wrong.mp3')
    wrongSound.play()
    wrongGuesses++
    document.getElementById('wrongLetters').textContent += `${guessedLetter}`
    
    // Update lives image
    const remainingLives = maxMistakes - wrongGuesses
    document.getElementById('livesImage').src = `img/${remainingLives + 1}-gold-coins.jpeg`

    // Check if player lost
    if (wrongGuesses === maxMistakes) {
        endGame(false)
    }
}

// Handle correct guesses
function updateCorrectGuess(guessedLetter) {
    const correctSound = new Audio('Correct.mp3')
    correctSound.play()
    let newDisplayedWord = ''

    // Show the correct letter in the word
    for (let i = 0; i < selectedWord.length; i++) {
        if (selectedWord[i] === guessedLetter) {
            newDisplayedWord += guessedLetter
        } else {
            newDisplayedWord += displayedWord[i]
        }
    }

    displayedWord = newDisplayedWord
    
    // Create a visual feedback for correct guess
    const feedback = document.createElement('div')
    feedback.textContent = '✓ Correct!'
    feedback.style.color = '#2e7d32'
    feedback.style.fontWeight = 'bold'
    feedback.style.fontSize = '1.2em'
    feedback.style.position = 'fixed'
    feedback.style.top = '50%'
    feedback.style.left = '50%'
    feedback.style.transform = 'translate(-50%, -50%)'
    feedback.style.padding = '15px 30px'
    feedback.style.backgroundColor = 'rgba(200, 230, 201, 0.9)'
    feedback.style.borderRadius = '10px'
    feedback.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)'
    feedback.style.zIndex = '1000'
    document.body.appendChild(feedback)
    
    // Remove feedback after animation
    setTimeout(() => {
        feedback.style.transition = 'opacity 0.5s ease'
        feedback.style.opacity = '0'
        setTimeout(() => {
            document.body.removeChild(feedback)
        }, 500)
    }, 800)

    updateUI()

    // Check if player won
    if (!displayedWord.includes('_')) {
        endGame(true)
    }
}

// Show win/lose message
function endGame(won) {
    if (won) {
        wins++
        // Play winning sound effect
        const winSound = new Audio('Correct.mp3')
        winSound.play()
    } else {
        losses++
        // Play losing sound effect
        const loseSound = new Audio('Wrong.mp3')
        loseSound.play()
    }
    updateScoreDisplay()
    
    let message = won
        ? '🎉 Congratulations! You guessed the word! 🍀'
        : `❌ Game Over! The word was "${selectedWord}".`

    const messageDiv = document.createElement('div')
    messageDiv.className = `alert ${won ? 'alert-success' : 'alert-danger'} mt-3`
    messageDiv.textContent = message
    
    // Add animation classes
    messageDiv.style.opacity = '0'
    messageDiv.style.transform = 'translateY(20px)'
    document.getElementById('gameArea').appendChild(messageDiv)
    
    // Trigger animation
    setTimeout(() => {
        messageDiv.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
        messageDiv.style.opacity = '1'
        messageDiv.style.transform = 'translateY(0)'
    }, 10)
}




// Make Enter key work for guessing
document.getElementById('letterInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        guessLetter()
    }
})