import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables'

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug, day, time, partySize } = req.query as {
    slug: string;
    day: string;
    time: string;
    partySize: string;
  };

  const errorMessage = 'Invalid data provided';

  if (!day || !time || !partySize) {
    return res.status(400).json({
      errorMessage,
    });
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
      open_time: true,
      close_time: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({
      errorMessage,
    });
  }

  const searchTimesWithTables = await findAvailableTables({
    res,
    time,
    day,
    errorMessage,
    restaurant,
  })

  if (!searchTimesWithTables) {
    return res.status(400).json({
      errorMessage,
    });
  }

  const availabilities = searchTimesWithTables.map((searchTimesWithTable) => {
    const sumSeats = searchTimesWithTable.tables.reduce((acc, table) => acc + table.seats, 0);

    const parsedPartySize = parseInt(partySize, 10);

    return {
      time: searchTimesWithTable.time,
      available: sumSeats >= parsedPartySize,
    };
  })
  .filter(availability => {
    const availabilityDateTime = new Date(`${day}T${availability.time}`)
    const openDateTime = new Date(`${day}T${restaurant.open_time}`)
    const closeDateTime = new Date(`${day}T${restaurant.close_time}`)

    const timeIsAfterOpeningHour = availabilityDateTime >= openDateTime
    const timeIsBeforeClosingHour = availabilityDateTime <= closeDateTime

    return timeIsAfterOpeningHour && timeIsBeforeClosingHour
  });

  return res.status(200).json(availabilities);
}
