'use server';

import { z } from 'zod';
import { createServerAction } from '../server-actions/server-action';
import { createUserDomain } from './domain/user';
import { UserFormDataType } from './repositories/User/model';

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'agent', 'user']).default('user'),
});

export const createUserAction = createServerAction()
  .input(createUserSchema)
  .handler(async ({ input }) => {
    const userData: Omit<UserFormDataType, 'createdAt'> = {
      ...input,
      active: true
    };

    const result = await createUserDomain(userData);
    return result;
  });
