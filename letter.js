var Letter = function (character) {
    this.character = character.toUpperCase();
    this.guessed = false;
    this.toString = function () {
        if (this.character === ' ') {
            this.guessed = true;
            return " ";
        } else {
            if (this.guessed)
                return this.character;
            else
                return "_";
        }
    };
    this.guess = function (letter) {
        if (letter === this.character)
            this.guessed = true;
    };
}

module.exports = Letter;