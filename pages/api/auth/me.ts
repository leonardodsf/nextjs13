import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import * as jose from 'jose';
import { PrismaClient } from '@prisma/client';

interface JWTPayloadProps {
  email: string;
  exp: number;
}

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const bearerToken = req.headers.authorization as string;
    const token = bearerToken.split(' ')[1];

    const errorMessage = 'Unauthorized, access is denied due to invalid credentials';

    const payload = jwt.decode(token) as JWTPayloadProps;

    if (!payload.email) {
      return res.status(401).json({
        errorMessage,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        city: true,
        phone: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        errorMessage: 'User not found',
      });
    }

    return res.status(200).json({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      city: user.city,
      phone: user.phone,
    });
  }

  res.status(501).send({
    error: 'Sorry, the request method is not supported by the server and cannot be handled.',
  });
}
