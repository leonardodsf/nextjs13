import type { NextApiRequest, NextApiResponse } from 'next';
import  { times } from '../../../../data'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { day, time, partySize } = req.query;
  const errorMessage = 'Invalid data provided'

  if (!day || !time || !partySize) {
    return res.status(400).json({
      errorMessage,
    });
  }

  const searchTimes = times.find(t => t.time === time)?.searchTimes

  if (!searchTimes) {
    return res.status(400).json({
      errorMessage,
    })
  }

  return res.status(200).json({
    searchTimes,
  });
}
