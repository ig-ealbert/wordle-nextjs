import type { NextApiRequest, NextApiResponse } from "next";
import { wordExists } from "@/types/wordExists";
import { dictionarySearch } from "@/lib/dictionarySearch";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<wordExists>,
) {
  const guess = req.query.word as string;
  const exists = dictionarySearch(guess);
  res.status(200).send({ exists });
}
