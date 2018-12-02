var Word = require("./Word.js");
var inquirer = require("inquirer");
// npm package used to validate an user input for a letter or not
var isLetter = require('is-letter');
// npm package used to make different text color
var cliColor = require('cli-color');
// npm package used to draw some diagram for plain-text
var figlet = require('figlet');
// Pre-defined color for incorrectly guessed letter
var incorrectColor = cliColor.red.bold;
// Pre-defined color for correctly guessed letter
var correctColor = cliColor.blue.bold;
// Pre-defined color for game text
var textColor = cliColor.greenBright;
// Pre-defined color for another game text 
var textColor1 = cliColor.cyanBright;

// Word list for guessing (National Parks of Canada)
var wordList = ["Aulavik", "Auyuittuq", "Banff", "Bruce Peninsula", "Cape Breton Highlands", "Elk Island", "Forillon", "Fundy", "Georgian Bay Islands", "Glacier",
    "Grasslands", "Gros Morne", "Gulf Islands", "Gwaii Haanas", "Ivvavik", "Jasper", "Kejimkujik", "Kluane", "Kootenay", "Kouchibouguac", "La Mauricie", "Mingan Archipelago",
    "Mount Revelstoke", "Nahanni", "Pacific Rim", "Prince Albert", "Prince Edward Island"];

var randomWord;
var guessWord;

var wins = 0;
var losses = 0;
var remainingGuesses = 12;

var lettersAlreadyGuessed = [];
var divider = '--------------------------------------------------------------------------------------------------\n';

figlet("Word Guess Game", function (err, data) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data);
    console.log(textColor1("Word Guess Game!\n"));
    console.log(textColor1("Theme is national parks of Canada.\n"));
    var instruction =
        divider +
        'Input any letter (a-z/A-Z) on the keyboard for guessing a letter.\n' +
        'For every incorrect guess, the remaining number of guesses will be reduced by 1.\n' +
        'If you guess all letters before running out of guesses, you win; otherwise, you lose the game.\n' +
        'The entire word is revealed when you lose.\n' +
        'A win/loss counter keeps track of current wins and losses for each game.\n' +
        divider +
        'You can exit the game at any time by pressing Ctrl + C.\n' +
        divider;
    console.log(textColor(instruction));
    startGame();
});

function startGame() {

    randomWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    guessWord = new Word(randomWord);
    lettersAlreadyGuessed = [];
    remainingGuesses = 12;

    // Omit space(s) when counting the word length
    var tempString = guessWord.letterObjects.map(o => o.character).join('');

    console.log(textColor('\nYour word contains ') + textColor1(`${tempString.replace(/\s/g, "").length}`) + textColor(' letters.\n'));
    guessLetter();
}

function guessLetter() {

    var oldCorrectedGuessed = 0; // Number of previous corrected guesses
    var currentCorrectedGuessed = 0; // Number of current corrected guesses 
    var isGuessedWordComplete = []; // Array contains true/false for each letter being guessed

    function checkGuesses(letter) {
        (letter.guessed) ? currentCorrectedGuessed++ : currentCorrectedGuessed;
        isGuessedWordComplete.push(letter.guessed);
    }

    // Update current number of corrected guesses
    guessWord.letterObjects.forEach(checkGuesses);

    // Store current to old number of corrected guesses for later comparison
    oldCorrectedGuessed = currentCorrectedGuessed;

    // Remaining letters for guessing
    if (isGuessedWordComplete.includes(false)) {
        inquirer
            .prompt([
                {
                    type: "input",
                    message: "Guess a letter between a-z/A-Z: ",
                    name: "letter",
                    validate: function (value) {
                        if (isLetter(value))
                            return true;
                        else
                            return false;
                    }
                }
            ])
            .then(function (guess) {

                var letter = guess.letter.toUpperCase();

                if (lettersAlreadyGuessed.includes(letter)) {
                    console.log(textColor("You already guessed this letter, please enter a new one.\n"));
                    guessLetter();
                } else {

                    guessWord.playerGuess(letter);

                    // Reset counter before checking number of corrected guesses
                    currentCorrectedGuessed = 0;
                    // Check if guess is correct or not
                    guessWord.letterObjects.forEach(checkGuesses);

                    // Check if current number of corrected guesses is equal to previous number of corrected guesses or not
                    if (oldCorrectedGuessed === currentCorrectedGuessed) {
                        console.log(incorrectColor('\nIncorrect!\n'));
                        remainingGuesses--;
                    } else
                        console.log(correctColor('\nCorrect!\n'));

                    lettersAlreadyGuessed.push(letter);

                    guessWord.showWord();

                    console.log(textColor('Guesses remaining: ') + textColor1(`${remainingGuesses}\n`));

                    console.log(textColor('Letters guessed: ') + textColor1(`${lettersAlreadyGuessed.join(" ")}\n\n`) + divider);

                    if (remainingGuesses > 0)
                        guessLetter();
                    else {
                        losses++;
                        console.log(textColor('You lose!\n'));
                        console.log(textColor(`Wins: ${wins}`));
                        console.log(textColor(`Losses: ${losses}\n`));
                        console.log(textColor('The correct national park was: ')+textColor1(`${randomWord}\n`));
                        restartGame();
                    }
                }

            })

    } else {
        wins++;
        console.log(textColor('You win!\n'));
        console.log(textColor(`Wins: ${wins}`));
        console.log(textColor(`Losses: ${losses}\n`));
        restartGame();
    }
}

function restartGame() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Would you like to:",
                choices: ["Play Again", "Exit"],
                name: "play"
            }
        ])
        .then(function (choice) {
            if (choice.play === "Play Again") {
                startGame();
            } else {
                console.log(textColor('Good bye! Come back soon!'));
                return;
            }
        })
}
