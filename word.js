var Letter = require("./letter.js");

function Word(answer) {
    // Letter objects array
    this.letterObjects = [];

    for (var i = 0; i < answer.length; i++) {
        var letter = new Letter(answer[i]);
        this.letterObjects.push(letter);
    }

    // Show word to terminal
    this.showWord = function () {
        wordList = "";
        for (var i = 0; i < this.letterObjects.length; i++) {
            wordList += this.letterObjects[i] + " ";
        }

        console.log(wordList + "\n");
    }
    
    // Set guessed = true if letter is guessed correctly
    this.playerGuess = function (letter) {
        for (var i=0; i < this.letterObjects.length; i++) {
            this.letterObjects[i].guess(letter);
        }
    }
}

module.exports = Word;