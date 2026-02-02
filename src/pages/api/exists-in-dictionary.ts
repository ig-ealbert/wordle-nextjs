import type { NextApiRequest, NextApiResponse } from "next";
import checkWord from "check-word";
import { wordExists } from "@/types/wordExists";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<wordExists>,
) {
  const guess = req.query.word;
  const words = checkWord("en");
  const exists = words.check(guess);
  res.status(200).send({ exists });
}
