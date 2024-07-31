// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '../../../lib/authoptions';

import type { NextApiRequest, NextApiResponse } from 'next';

const authHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  return await NextAuth(req, res, authOptions);
};

export default authHandler;

// Explicitly export handlers for GET and POST
export const GET = (req: NextApiRequest, res: NextApiResponse) => authHandler(req, res);
export const POST = (req: NextApiRequest, res: NextApiResponse) => authHandler(req, res);
