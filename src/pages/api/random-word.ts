import type { NextApiRequest, NextApiResponse } from 'next'
import { words } from "./words";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const index = Math.floor(Math.random() * words.length);
  res.status(200).send(words[index]);
}