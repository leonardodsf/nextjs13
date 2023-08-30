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
      city: true,
      phone: true,
      email: true,
      created_at: true,
      updated_at: true,
    }
  });

  return res.status(200).json({ user });
}
