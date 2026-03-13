import type { NextApiRequest, NextApiResponse } from "next";
import { wordleInstance } from "@/lib/wordle";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>,
) {
  const guess = (req.query.guess as string) || "";
  if (guess === "") {
    console.log(`Unable to get colors for guess letters - empty guess`);
    res.status(500).send([]);
  }
  const colors = wordleInstance.getLetterColors(guess);
  res.status(200).send(colors);
}
