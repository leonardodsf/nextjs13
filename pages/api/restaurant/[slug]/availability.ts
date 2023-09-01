import type { NextApiRequest, NextApiResponse } from 'next';
import { times } from '../../../../data';
import { PrismaClient } from '@prisma/client';

interface BookingTablesObjectProps {
  [key: string]: {
    [key: number]: true;
  };
}

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

  const searchTimes = times.find((t) => t.time === time)?.searchTimes;

  if (!searchTimes) {
    return res.status(400).json({
      errorMessage,
    });
  }

  const firstAvailabilityDate = new Date(`${day}T${searchTimes[0]}`);
  const lastAvailabilityDate = new Date(`${day}T${searchTimes[searchTimes.length - 1]}`);

  const bookings = await prisma.booking.findMany({
    where: {
      booking_time: {
        gte: firstAvailabilityDate,
        lte: lastAvailabilityDate,
      },
    },
    select: {
      number_of_people: true,
      booking_time: true,
      tables: true,
    },
  });

  const bookingTablesObject: BookingTablesObjectProps = {};

  bookings.forEach((booking) => {
    const bookingTime = booking.booking_time.toISOString();

    bookingTablesObject[bookingTime] = booking.tables.reduce((acc, table) => {
      return {
        ...acc,
        [table.table_id]: true,
      };
    }, {});
  });

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      slug,
    },
    select: {
      tables: true,
    },
  });

  if (!restaurant) {
    return res.status(400).json({
      errorMessage,
    });
  }

  const tables = restaurant.tables;

  const searchTimesWithTables = searchTimes.map((searchTime) => {
    const searchTimeDate = new Date(`${day}T${searchTime}`);

    return {
      date: searchTimeDate,
      time: searchTime,
      tables,
    };
  });

  searchTimesWithTables.forEach((searchTimesWithTable) => {
    searchTimesWithTable.tables = searchTimesWithTable.tables.filter(
      (table) => !bookingTablesObject[searchTimesWithTable.date.toISOString()]?.[table.id]
    );
  });

  return res.status(200).json({
    searchTimes,
    bookings,
    tables,
    searchTimesWithTables,
    bookingTablesObject,
  });
}
