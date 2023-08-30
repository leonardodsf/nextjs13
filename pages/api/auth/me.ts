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
  const bearerToken = req.headers.authorization;
  const errorMessage = 'Unauthorized, access is denied due to invalid credentials';

  if (!bearerToken) {
    return res.status(401).json({
      errorMessage,
    });
  }

  const token = bearerToken.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      errorMessage,
    });
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return res.status(401).json({
      errorMessage,
    });
  }

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
