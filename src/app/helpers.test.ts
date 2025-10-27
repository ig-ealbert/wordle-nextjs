import assert from "assert";
import { describe, it } from "@jest/globals";
import {
  findGreens,
  findYellows,
  getEndGameMessage,
  getLetterCountInArray,
  getLetterStyle,
} from "./helpers.ts";

describe("Helper functions for wordle in next.js", () => {
  it("Gets the count of letters in array when there are matches", () => {
    const expectedCount = 2;
    const actualCount = getLetterCountInArray("a", "apartment".split(""));
    assert.strictEqual(actualCount, expectedCount);
  });

  it("Gets the count of letters in array when there are no matches", () => {
    const expectedCount = 0;
    const actualCount = getLetterCountInArray("b", "apartment".split(""));
    assert.strictEqual(actualCount, expectedCount);
  });

  it("Finds green letters when they exist in the guess", () => {
    const expectedGreens = ["a", "b"];
    const actualGreens = findGreens("abcde", "abfgh");
    assert.deepStrictEqual(actualGreens, expectedGreens);
  });

  it("Finds green letters but not yellow letters", () => {
    const expectedGreens = ["a"];
    const actualGreens = findGreens("abcde", "afghb");
    assert.deepStrictEqual(actualGreens, expectedGreens);
  });

  it("Finds no green letters", () => {
    const expectedGreens: string[] = [];
    const actualGreens = findGreens("abcde", "bfghc");
    assert.deepStrictEqual(actualGreens, expectedGreens);
  });

  it("Finds yellow letters when there are no green letters", () => {
    const expectedYellows = [0, 1];
    const actualYellows = findYellows("abcde", "bafgh", []);
    assert.deepStrictEqual(actualYellows, expectedYellows);
  });

  it("Finds yellow letters when there is a green letter", () => {
    const expectedYellows = [0];
    const actualYellows = findYellows("aacde", "baafg", ["a"]);
    assert.deepStrictEqual(actualYellows, expectedYellows);
  });

  it("Finds no yellow letters when they are green letters", () => {
    const expectedYellows: number[] = [];
    const actualYellows = findYellows("aacde", "aabfg", ["a", "a"]);
    assert.deepStrictEqual(actualYellows, expectedYellows);
  });

  it("Gets end game message for win", () => {
    const info = {
      userGuess: "abcde",
      secretWord: "abcde",
      remainingGuesses: 2,
    };
    const message = getEndGameMessage(info);
    const expected = `You guessed the word in 3 guesses!`;
    assert.strictEqual(message, expected);
  });

  it("Gets end game message for loss", () => {
    const info = {
      userGuess: "abcde",
      secretWord: "abcdf",
      remainingGuesses: 0,
    };
    const message = getEndGameMessage(info);
    const expected = `The word was abcdf.  Reset the game and try again!`;
    assert.strictEqual(message, expected);
  });

  it("Returns empty string when game is neither lost nor won", () => {
    const info = {
      userGuess: "abcde",
      secretWord: "abcdf",
      remainingGuesses: 1,
    };
    const message = getEndGameMessage(info);
    assert.strictEqual(message, "");
  });

  it("Gets green letter style", () => {
    const info = {
      guess: "abcde",
      letterIndex: 0,
      attempt: 0,
      secretWord: "amass",
      yellowIndices: [[]],
    };
    const style = getLetterStyle(info);
    assert.strictEqual(style, "green");
  });

  it("Gets yellow letter style", () => {
    const info = {
      guess: "bacde",
      letterIndex: 1,
      attempt: 0,
      secretWord: "amass",
      yellowIndices: [[1]],
    };
    const style = getLetterStyle(info);
    assert.strictEqual(style, "yellow");
  });

  it("Gets no letter style when yellow letter already found", () => {
    const info = {
      guess: "mnmde",
      letterIndex: 2,
      attempt: 0,
      secretWord: "amass",
      yellowIndices: [[0]],
    };
    const style = getLetterStyle(info);
    assert.strictEqual(style, "");
  });

  it("Gets no letter style", () => {
    const info = {
      guess: "abcde",
      letterIndex: 0,
      attempt: 0,
      secretWord: "fghij",
      yellowIndices: [[]],
    };
    const style = getLetterStyle(info);
    assert.strictEqual(style, "");
  });
});
