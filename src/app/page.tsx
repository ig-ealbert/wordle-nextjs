'use client'

import { useEffect, useState } from "react";
import { words } from "./words";

export default function Home() {
  const ALLOWED_GUESSES = 5;
  const WORD_LENGTH = 5;

  const [secretWord, setSecretWord] = useState<string>('');

  function chooseSecretWord() {
    const index = Math.floor(Math.random() * words.length);
    setSecretWord(words[index]);
  }
  useEffect(() => chooseSecretWord(), []);

  const [remainingGuesses, setRemainingGuesses] = useState<number>(ALLOWED_GUESSES);
  useEffect(() => {
    setRemainingGuesses(ALLOWED_GUESSES);
  }, [secretWord]);
  useEffect(() => {
    checkForWin()
  }, [remainingGuesses]);

  const [feedback, setFeedback] = useState<string>('');
  useEffect(() => {
    setFeedback('');
  }, [secretWord]);

  const [userGuess, setUserGuess] = useState<string>('');
  useEffect(() => {
    setUserGuess('');
  }, [secretWord]);

  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  useEffect(() => setGuessHistory([]), [secretWord]);

  const [yellowIndices, setYellowIndices] = useState<number[][]>([]);
  useEffect(() => setYellowIndices([]), [secretWord]);

  function validateGuess(guess: string) {
    if (guess.length > WORD_LENGTH) {
      return guess.substring(0, WORD_LENGTH);
    }
    if (guess.length < WORD_LENGTH) {
      return `${guess}${"x".repeat(WORD_LENGTH - guess.length)}`;
    }
    return guess;
  }

  function handleGuess() {
    const guess = validateGuess(userGuess);
    setGuessHistory(guessHistory.concat(guess));
    scoreLetters(guess);
    setRemainingGuesses(remainingGuesses - 1);
  }

  function scoreLetters(guess: string) {
    const greens = findGreens(guess);
    findYellows(guess, greens);
  }

  function findGreens(guess: string) {
    const letters = guess.split('');
    return letters.filter((letter, index) => letter === secretWord[index]);
  }

  function findYellows(guess: string, greens: string[]) {
    const letters = guess.split('');
    const yellows: string[] = [];
    const currentYellows: number[] = [];
    letters.forEach((letter, index) => {
      const allInstances = getLetterCountInArray(letter, secretWord.split(''));
      const greenInstances = getLetterCountInArray(letter, greens);
      const yellowInstances = getLetterCountInArray(letter, yellows);
      if (letter !== secretWord[index] &&
          secretWord.includes(letter) &&
          allInstances > greenInstances + yellowInstances) {
            yellows.push(letter);
            currentYellows.push(index);
          }
      }
    );
    const newYellowIndices = yellowIndices.slice();
    newYellowIndices.push(currentYellows);
    setYellowIndices(newYellowIndices);
  }

  function getLetterStyle(guess: string, letterIndex: number, attempt: number) {
    if (guess[letterIndex] === secretWord[letterIndex]) {
      return "green";
    }
    if (yellowIndices[attempt].includes(letterIndex)) {
      return "yellow";
    }
    return "";
  }
  
  function getLetterCountInArray(letter: string, array: string[]) {
    const matches = array.filter((arrayLetter) => arrayLetter === letter);
    return matches.length;
  }
  
  function checkForWin() {
    if (userGuess === secretWord) {
      setFeedback(`You guessed the word in ${ALLOWED_GUESSES - remainingGuesses} guesses!`);
    }
    else if (remainingGuesses === 0) {
      setFeedback(`The word was ${secretWord}.  Reset the game and try again!`);
    }
  }

  return (
    <div>
      <div>
        <input id="currentGuess" value={userGuess}
               onChange={(e) => {setUserGuess(e.target.value)}}></input>
        <button disabled={remainingGuesses <= 0} onClick={handleGuess}>Guess</button>
      </div>
      <div id="guessHistory">
        {guessHistory.map((guess, index) => {
          return (
            <div key={guess}>
              <span className={getLetterStyle(guess, 0, index)}>{guess[0]}</span>
              <span className={getLetterStyle(guess, 1, index)}>{guess[1]}</span>
              <span className={getLetterStyle(guess, 2, index)}>{guess[2]}</span>
              <span className={getLetterStyle(guess, 3, index)}>{guess[3]}</span>
              <span className={getLetterStyle(guess, 4, index)}>{guess[4]}</span>
            </div>
          )
        })}
      </div>
      <div>
        <p id="feedback">{feedback}</p>
        <button onClick={chooseSecretWord}>Reset</button>
      </div>
    </div>
  );
}
