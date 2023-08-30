import type { NextApiRequest, NextApiResponse } from 'next';
import validator from 'validator';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as jose from 'jose';

interface BodyResponseProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  password: string;
}

interface ErrorsProps extends BodyResponseProps {}

interface ValidationSchemaProps {
  key: 'firstName' | 'lastName' | 'email' | 'phone' | 'city' | 'password';
  valid: boolean;
  errorMessage: string;
}

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, email, phone, city, password } = req.body as BodyResponseProps;

    const validationSchema: ValidationSchemaProps[] = [
      {
        key: 'firstName',
        valid: validator.isLength(firstName, {
          min: 1,
          max: 20,
        }),
        errorMessage: 'First Name is invalid',
      },
      {
        key: 'lastName',
        valid: validator.isLength(lastName, {
          min: 1,
          max: 20,
        }),
        errorMessage: 'Last Name is invalid',
      },
      {
        key: 'email',
        valid: validator.isEmail(email),
        errorMessage: 'Email is invalid',
      },
      {
        key: 'phone',
        valid: validator.isMobilePhone(phone),
        errorMessage: 'Phone number is invalid',
      },
      {
        key: 'city',
        valid: validator.isLength(city, {
          min: 1,
        }),
        errorMessage: 'City is invalid',
      },
      {
        key: 'password',
        valid: validator.isStrongPassword(password),
        errorMessage: 'Password is not strong enough',
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
      },
    });

    if (userWithEmail) {
      return res.status(200).send({
        errorMessage: 'Email is associated with another account',
      });
    }

    const saltPassword = 10;
    const hashedPassword = await bcrypt.hash(password, saltPassword);

    const user = await prisma.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        city,
        phone,
        password: hashedPassword,
      },
    });

    const alg = 'HS256';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const token = await new jose.SignJWT({ email: user.email })
      .setProtectedHeader({ alg })
      .setExpirationTime('24h')
      .sign(secret);

    return res.status(200).send({
      message: 'User has been created!',
      token,
    });
  }

  res.status(501).send({
    error: 'Sorry, the request method is not supported by the server and cannot be handled.',
  });
}
