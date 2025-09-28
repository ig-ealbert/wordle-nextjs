export function findGreens(guess: string, secretWord: string) {
  const letters = guess.split("");
  return letters.filter((letter, index) => letter === secretWord[index]);
}

export function findYellows(
  guess: string,
  secretWord: string,
  greens: string[]
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
