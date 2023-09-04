import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { findAvailableTables } from '../../../../services/restaurant/findAvailableTables';

interface TablesCount {
  2: number[];
  4: number[];
}

interface ReqBodyProps {
  bookerEmail: string;
  bookerPhone: string;
  bookerFirstName: string;
  bookerLastName: string;
  bookerOccasion?: string;
  bookerRequest?: string;
}

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { slug, day, time, partySize } = req.query as {
      slug: string;
      day: string;
      time: string;
      partySize: string;
    };

    const {
      bookerEmail,
      bookerPhone,
      bookerFirstName,
      bookerLastName,
      bookerOccasion,
      bookerRequest,
    } = req.body as ReqBodyProps;

    const errorMessage = 'Invalid data provided';

    const restaurant = await prisma.restaurant.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        tables: true,
        open_time: true,
        close_time: true,
      },
    });

    if (!restaurant) {
      return res.status(404).json({
        errorMessage: 'Restaurant not found',
      });
    }

    const bookingTime = new Date(`${day}T${time}`);
    const openTime = new Date(`${day}T${restaurant.open_time}`);
    const closeTime = new Date(`${day}T${restaurant.close_time}`);

    if (bookingTime < openTime || bookingTime > closeTime) {
      return res.status(401).json({
        errorMessage: 'Restaurant is not open at that time',
      });
    }

    const searchTimesWithTables = await findAvailableTables({
      res,
      time,
      day,
      errorMessage,
      restaurant,
    });

    if (!searchTimesWithTables) {
      return res.status(400).json({
        errorMessage,
      });
    }

    const searchTimeWithTables = searchTimesWithTables.find((searchTimesWithTable) => {
      return searchTimesWithTable.date.toISOString() === bookingTime.toISOString();
    });

    if (!searchTimeWithTables) {
      return res.status(400).json({
        errorMessage: 'No availability, cannot book',
      });
    }

    const tablesCount: TablesCount = {
      2: [],
      4: [],
    };

    searchTimeWithTables.tables.forEach((table) => {
      if (table.seats === 2) {
        tablesCount[2].push(table.id);
      } else {
        tablesCount[4].push(table.id);
      }
    });

    const tablesToBooks: number[] = [];

    let seatsRemaining = parseInt(partySize, 10);

    while (seatsRemaining > 0) {
      if (seatsRemaining >= 3) {
        if (tablesCount[4].length) {
          tablesToBooks.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        } else {
          tablesToBooks.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        }
      } else {
        if (tablesCount[2].length) {
          tablesToBooks.push(tablesCount[2][0]);
          tablesCount[2].shift();
          seatsRemaining = seatsRemaining - 2;
        } else {
          tablesToBooks.push(tablesCount[4][0]);
          tablesCount[4].shift();
          seatsRemaining = seatsRemaining - 4;
        }
      }
    }

    const booking = await prisma.booking.create({
      data: {
        number_of_people: parseInt(partySize, 10),
        booking_time: bookingTime,
        booker_email: bookerEmail,
        booker_phone: bookerPhone,
        booker_first_name: bookerFirstName,
        booker_last_name: bookerLastName,
        booker_request: bookerRequest,
        booker_occasion: bookerOccasion,
        restaurant_id: restaurant.id,
      },
    });

    const bookingsTableOnData = tablesToBooks.map((table_id) => {
      return {
        table_id,
        booking_id: booking.id,
      };
    });

    await prisma.bookingsOnTables.createMany({
      data: bookingsTableOnData,
    });

    return res.status(200).json(booking);
  }

  res.status(501).send({
    error: 'Sorry, the request method is not supported by the server and cannot be handled.',
  });
}
