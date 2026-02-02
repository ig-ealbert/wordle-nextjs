import checkWord from "check-word";

export function dictionarySearch(word: string) {
  const words = checkWord("en");
  return words.check(word);
}
