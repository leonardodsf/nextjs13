import type { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

interface BodyResponseProps {
  email: string;
  password: string;
}

interface ErrorsProps extends BodyResponseProps {}

interface ValidationSchemaProps {
  key: 'email' | 'password';
  valid: boolean;
  errorMessage: string;
}

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body as BodyResponseProps

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

    const errors = validationSchema.reduce((accumulator, validation) => {
      if (!validation.valid) {
        accumulator[validation.key] = validation.errorMessage;
      }
      return accumulator;
    }, {} as ErrorsProps);

    if (Object.keys(errors).length) {
      return res.status(400).json({
        errors,
      });
    }

    const userWithEmail = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (!userWithEmail) {
      return res.status(401).json({
        errorMessage: 'Email or password is invalid'
      })
    }

    const isMatch = await bcrypt.compare(password, userWithEmail.password)

    if (!isMatch) {
      return res.status(401).json({
        errorMessage: 'Email or password is invalid'
      })
    }

    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: userWithEmail.email })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    return res.status(200).json({
      message: 'Login successful',
      token
    })
  }

  res.status(501).send({
    error: 'Sorry, the request method is not supported by the server and cannot be handled.',
  });
}