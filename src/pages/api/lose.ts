import type { NextApiRequest, NextApiResponse } from "next";
import { wordleInstance } from "@/lib/wordle";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>,
) {
  const message = wordleInstance.getLossMessage();
  res.status(200).send(message);
}
