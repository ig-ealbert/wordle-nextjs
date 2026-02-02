import assert from "assert";
import { describe, it } from "@jest/globals";
import { dictionarySearch } from "./dictionarySearch";

describe("Helper functions for wordle in next.js", () => {
  it("Validates a guess that is in the dictionary", () => {
    const exists = dictionarySearch("hello");
    assert.strictEqual(exists, true);
  });

  it("Stops a guess that is not in the dictionary", () => {
    const exists = dictionarySearch("abcde");
    assert.strictEqual(exists, false);
  });
});
