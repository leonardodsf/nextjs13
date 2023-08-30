import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';

export async function middleware(req: NextRequest, res: NextResponse) {
  const bearerToken = req.headers.get('authorization') as string;
  const errorMessage = 'Unauthorized, access is denied due to invalid credentials';

  const nextResponse = (status: number, errorMessage: string) => {
    return new NextResponse(JSON.stringify({ errorMessage }), {
      status,
    });
  }

  if (!bearerToken) {
    return nextResponse(401, errorMessage)
  }

  const token = bearerToken.split(' ')[1];

  if (!token) {
    return nextResponse(401, errorMessage)
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    await jose.jwtVerify(token, secret);
  } catch (error) {
    return nextResponse(401, errorMessage)
  }
}

export const config = {
  matcher: ['/api/auth/me'],
};
