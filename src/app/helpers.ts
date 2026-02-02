import { endGameInfo } from "@/types/endGameInfo";
import { ALLOWED_GUESSES } from "./constants";
import { letterStyleInfo } from "@/types/letterStyleInfo";

export function findGreens(guess: string, secretWord: string) {
  const letters = guess.split("");
  return letters.filter((letter, index) => letter === secretWord[index]);
}

export function findYellows(
  guess: string,
  secretWord: string,
  greens: string[],
) {
  const letters = guess.split("");
  const yellows: string[] = [];
  const currentYellows: number[] = [];
  letters.forEach((letter, index) => {
    const allInstances = getLetterCountInArray(letter, secretWord.split(""));
    const greenInstances = getLetterCountInArray(letter, greens);
    const yellowInstances = getLetterCountInArray(letter, yellows);
    if (
      letter !== secretWord[index] &&
      secretWord.includes(letter) &&
      allInstances > greenInstances + yellowInstances
    ) {
      yellows.push(letter);
      currentYellows.push(index);
    }
  });
  return currentYellows;
}

export function getLetterCountInArray(letter: string, array: string[]) {
  return array.filter((arrayLetter) => arrayLetter === letter).length;
}

export function getEndGameMessage(info: endGameInfo) {
  if (info.userGuess === info.secretWord) {
    return `You guessed the word in ${
      ALLOWED_GUESSES - info.remainingGuesses
    } guesses!`;
  } else if (info.remainingGuesses === 0) {
    return `The word was ${info.secretWord}.  Reset the game and try again!`;
  } else return "";
}

export function getLetterStyle(info: letterStyleInfo) {
  if (info.guess[info.letterIndex] === info.secretWord[info.letterIndex]) {
    return "green";
  }
  if (info.yellowIndices[info.attempt].includes(info.letterIndex)) {
    return "yellow";
  }
  return "";
}

export async function isInDictionary(word: string) {
  const response = await fetch(`/api/exists-in-dictionary?word=${word}`);
  return (await response.json()).exists;
}
