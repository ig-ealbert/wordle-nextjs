"use client";

import { useEffect, useState } from "react";
import { ALLOWED_GUESSES, WORD_LENGTH } from "./constants";
import {
  findGreens,
  findYellows,
  getEndGameMessage,
  getLetterStyle,
  isInDictionary,
} from "./helpers";

export default function Home() {
  const [secretWord, setSecretWord] = useState<string>("");

  async function chooseSecretWord() {
    const response = await fetch("/api/random-word");
    const word = await response.text();
    setSecretWord(word);
  }
  useEffect(() => {
    chooseSecretWord();
  }, []);

  const [remainingGuesses, setRemainingGuesses] =
    useState<number>(ALLOWED_GUESSES);
  useEffect(() => setRemainingGuesses(ALLOWED_GUESSES), [secretWord]);
  useEffect(() => checkForWin(), [remainingGuesses]);

  const [feedback, setFeedback] = useState<string>("");
  useEffect(() => setFeedback(""), [secretWord]);

  const [userGuess, setUserGuess] = useState<string>("");
  useEffect(() => setUserGuess(""), [secretWord]);

  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  useEffect(() => setGuessHistory([]), [secretWord]);

  const [yellowIndices, setYellowIndices] = useState<number[][]>([]);
  useEffect(() => setYellowIndices([]), [secretWord]);

  async function handleGuess() {
    const isValid = await isInDictionary(userGuess);
    if (isValid) {
      setFeedback("");
      setGuessHistory(guessHistory.concat(userGuess));
      scoreLetters(userGuess);
      setRemainingGuesses(remainingGuesses - 1);
    } else {
      setFeedback(`${userGuess} is not in the dictionary`);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleGuess();
    }
  }

  function scoreLetters(guess: string) {
    const greens = findGreens(guess, secretWord);
    const yellows = findYellows(guess, secretWord, greens);
    const newYellowIndices = yellowIndices.slice();
    newYellowIndices.push(yellows);
    setYellowIndices(newYellowIndices);
  }

  function letterStyle(guess: string, letterIndex: number, attempt: number) {
    const info = {
      guess,
      letterIndex,
      attempt,
      secretWord,
      yellowIndices,
    };
    return getLetterStyle(info);
  }

  function checkForWin() {
    const info = {
      userGuess,
      secretWord,
      remainingGuesses,
    };
    setFeedback(getEndGameMessage(info));
  }

  return (
    <div>
      <div>
        <input
          id="currentGuess"
          value={userGuess}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setUserGuess(e.target.value);
          }}
        ></input>
        <button
          id="guessButton"
          disabled={remainingGuesses <= 0 || userGuess.length !== WORD_LENGTH}
          onClick={handleGuess}
        >
          Guess
        </button>
      </div>
      <div id="guessHistory">
        {guessHistory.map((guess, index) => {
          return (
            <div key={guess}>
              <span className={letterStyle(guess, 0, index)}>{guess[0]}</span>
              <span className={letterStyle(guess, 1, index)}>{guess[1]}</span>
              <span className={letterStyle(guess, 2, index)}>{guess[2]}</span>
              <span className={letterStyle(guess, 3, index)}>{guess[3]}</span>
              <span className={letterStyle(guess, 4, index)}>{guess[4]}</span>
            </div>
          );
        })}
      </div>
      <div>
        <p id="feedback">{feedback}</p>
        <button onClick={chooseSecretWord}>Reset</button>
      </div>
    </div>
  );
}
