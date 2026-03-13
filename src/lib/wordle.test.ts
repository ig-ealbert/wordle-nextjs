import assert from "assert";
import { describe, it } from "@jest/globals";
import { wordleInstance } from "./wordle.ts";

describe("Wordle class methods", () => {
  it("Constructs", () => {
    assert.ok(wordleInstance);
  });

  it("Has a random word upon initialization", () => {
    assert.ok(wordleInstance.word !== "");
  });

  it("Gets all greens", () => {
    const word = wordleInstance.word;
    const letterColors = wordleInstance.getLetterColors(word);
    const expected = new Array(5).fill("green");
    assert.deepStrictEqual(letterColors, expected);
  });

  it("Gets all yellows", () => {
    const word = wordleInstance.word;
    const guess = `${word[word.length - 1]}${word.substring(0, word.length - 1)}`;
    const letterColors = wordleInstance.getLetterColors(guess);
    const expected = new Array(5).fill("yellow");
    assert.deepStrictEqual(letterColors, expected);
  });

  it("Gets no colors when all letters are wrong", () => {
    const guess = "_".repeat(5);
    const letterColors = wordleInstance.getLetterColors(guess);
    const expected = new Array(5).fill("");
    assert.deepStrictEqual(letterColors, expected);
  });

  it("Gets a mix of green, yellow, and no colors", () => {
    const word = wordleInstance.word;
    const guess = `${word[0]}${word[2]}__${word[1]}`;
    const letterColors = wordleInstance.getLetterColors(guess);
    const expected = ["green", "yellow", "", "", "yellow"];
    assert.deepStrictEqual(letterColors, expected);
  });

  it("Gets end game message for loss", () => {
    const message = wordleInstance.getLossMessage();
    const word = wordleInstance.word;
    const expected = `The word was ${word}.  Reset the game and try again!`;
    assert.strictEqual(message, expected);
  });
});
