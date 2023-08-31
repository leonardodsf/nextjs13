import type { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';
import { setCookie } from 'cookies-next';

interface BodyResponseProps {
  email: string;
  password: string;
}

interface ValidationSchemaProps {
  key: 'email' | 'password';
  valid: boolean;
  errorMessage: string;
}

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body as BodyResponseProps;

    const validationSchema: ValidationSchemaProps[] = [
      {
        key: 'email',
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid',
      },
      {
        key: 'password',
        valid: validator.isLength(password, {
          min: 1,
        }),
        errorMessage: 'Password is invalid',
      },
    ];

    const errors = validationSchema.filter(validation => !validation.valid)

    if (errors.length) {
      return res.status(400).json({
        errorMessage: errors[0].errorMessage,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        errorMessage: 'Email or password is invalid',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        errorMessage: 'Email or password is invalid',
      });
    }

    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    setCookie('jwt', token, {
      req,
      res,
      maxAge: 60 * 6 * 24,
    });

    return res.status(200).json({
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
