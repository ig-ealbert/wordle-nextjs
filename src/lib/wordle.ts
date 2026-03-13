import { words } from "./words";

class Wordle {
  word = "";

  constructor() {
    this.setRandomWord();
  }

  setRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    this.word = words[index];
  }

  getLetterColors(guess: string) {
    const colors = ["", "", "", "", ""];
    const greens = [];
    for (let i = 0; i < this.word.length; i++) {
      if (guess[i] === this.word[i]) {
        colors[i] = "green";
        greens.push(guess[i]);
      }
    }
    const yellowIndices = this.findYellows(guess, greens);
    for (const index of yellowIndices) {
      colors[index] = "yellow";
    }
    return colors;
  }

  private getLetterCountInArray(letter: string, array: string[]) {
    return array.filter((arrayLetter) => arrayLetter === letter).length;
  }

  private findYellows(guess: string, greens: string[]) {
    const letters = guess.split("");
    const yellows: string[] = [];
    const currentYellows: number[] = [];
    letters.forEach((letter, index) => {
      const allInstances = this.getLetterCountInArray(
        letter,
        this.word.split(""),
      );
      const greenInstances = this.getLetterCountInArray(letter, greens);
      const yellowInstances = this.getLetterCountInArray(letter, yellows);
      if (
        letter !== this.word[index] &&
        this.word.includes(letter) &&
        allInstances > greenInstances + yellowInstances
      ) {
        yellows.push(letter);
        currentYellows.push(index);
      }
    });
    return currentYellows;
  }

  getLossMessage() {
    return `The word was ${this.word}.  Reset the game and try again!`;
  }
}

export const wordleInstance = new Wordle();
