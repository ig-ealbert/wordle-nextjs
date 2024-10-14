'use client'

import { useEffect, useState } from "react";
import { findGreens, findYellows, validateGuess } from "./helpers";

export default function Home() {
  const ALLOWED_GUESSES = 5;

  const [secretWord, setSecretWord] = useState<string>('');

  async function chooseSecretWord() {
    const response = await fetch('/api/random-word');
    const word = await response.text();
    setSecretWord(word);
  }
  useEffect(() => {chooseSecretWord()}, []);

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

  function handleGuess() {
    const guess = validateGuess(userGuess);
    setGuessHistory(guessHistory.concat(guess));
    scoreLetters(guess);
    setRemainingGuesses(remainingGuesses - 1);
  }

  function scoreLetters(guess: string) {
    const greens = findGreens(guess, secretWord);
    const yellows = findYellows(guess, secretWord, greens);
    const newYellowIndices = yellowIndices.slice();
    newYellowIndices.push(yellows);
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
