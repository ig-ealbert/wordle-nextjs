import assert from "assert";
import { describe, it } from "@jest/globals";
import { findGreens, findYellows, getLetterCountInArray } from "./helpers.ts";

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
});
