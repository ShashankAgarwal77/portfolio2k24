import { NextApiRequest, NextApiResponse } from 'next'

export default async function fetchDribbbleShots(req: NextApiRequest, res: NextApiResponse) {
  const response = await fetch('https://api.dribbble.com/v2/user/shots?access_token=9a196114b5cb58681e43cada47a2f264bb97e7fc15cc1987f8d1ff21de2e4120')
  const data = await response.json()

  res.status(200).json(data)
}
