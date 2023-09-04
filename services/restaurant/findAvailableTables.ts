import { NextApiResponse } from 'next';
import { PrismaClient, Table } from '@prisma/client';

import { times } from '../../data';

interface RestaurantProps {
  tables: Table[];
  open_time: string;
  close_time: string;
}

interface FindAvailableTablesProps {
  res: NextApiResponse;
  time: string;
  day: string;
  errorMessage: string;
  restaurant: RestaurantProps;
}

interface BookingTablesObjectProps {
  [key: string]: {
    [key: number]: boolean;
  };
}

const prisma = new PrismaClient();

export const findAvailableTables = async ({
  res,
  time,
  day,
  errorMessage,
  restaurant
}: FindAvailableTablesProps) => {
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

  return searchTimesWithTables;
};
