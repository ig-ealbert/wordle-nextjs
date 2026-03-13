"use client";

import { useEffect, useState } from "react";
import { ALLOWED_GUESSES, WORD_LENGTH } from "./constants";

export default function Home() {
  const [remainingGuesses, setRemainingGuesses] =
    useState<number>(ALLOWED_GUESSES);
  const [feedback, setFeedback] = useState<string>("");
  const [userGuess, setUserGuess] = useState<string>("");
  const [guessHistory, setGuessHistory] = useState<string[]>([]);
  const [guessColors, setGuessColors] = useState<string[][]>([]);

  async function initialize() {
    await fetch("/api/random-word");
    setRemainingGuesses(ALLOWED_GUESSES);
    setFeedback("");
    setUserGuess("");
    setGuessHistory([]);
    setGuessColors([]);
  }
  useEffect(() => {
    initialize();
  }, []);

  async function handleGuess() {
    setGuessHistory(guessHistory.concat(userGuess));
    const scoredLetters = await scoreLetters(userGuess);
    setRemainingGuesses(remainingGuesses - 1);
    checkForWin(scoredLetters, remainingGuesses - 1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleGuess();
    }
  }

  async function scoreLetters(guess: string) {
    const response = await fetch(`/api/color-guess?guess=${guess}`);
    const scoredColors: string[] = await response.json();
    const newScoredColors = guessColors.slice();
    newScoredColors.push(scoredColors);
    setGuessColors(newScoredColors);
    return scoredColors;
  }

  async function checkForWin(colors: string[], guessesLeft: number) {
    const greens = colors.filter((color) => color === "green").length;
    if (greens === WORD_LENGTH) {
      setFeedback(
        `You guessed the word in ${ALLOWED_GUESSES - guessesLeft} guesses!`,
      );
    } else if (guessesLeft === 0) {
      const messageResponse = await fetch("/api/lose");
      const message = await messageResponse.text();
      setFeedback(message);
    }
  }

  function colorHandler(turn: number, index: number) {
    if (guessColors.length <= turn || guessColors[turn].length < 5) {
      return "";
    }
    return guessColors[turn][index];
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
            <div key={`${guess}${index}`}>
              <span className={colorHandler(index, 0)}>{guess[0]}</span>
              <span className={colorHandler(index, 1)}>{guess[1]}</span>
              <span className={colorHandler(index, 2)}>{guess[2]}</span>
              <span className={colorHandler(index, 3)}>{guess[3]}</span>
              <span className={colorHandler(index, 4)}>{guess[4]}</span>
            </div>
          );
        })}
      </div>
      <div>
        <p id="feedback">{feedback}</p>
        <button onClick={initialize}>Reset</button>
      </div>
    </div>
  );
}
