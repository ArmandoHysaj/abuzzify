import z from 'zod';

export const RoleEnum = z.enum(['admin', 'agent', 'user']);


export const baseUserData = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: RoleEnum,
  active: z.boolean(),
  createdAt: z.string(),
  createdBy: z.string().optional(),
  updatedAt: z.string().optional(),
  lastLogin: z.string().optional()
});

export const userDomainResponse = baseUserData.extend({
  id: z.string()
});

export const UserFormData = baseUserData.extend({
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export type UserFormDataType = z.infer<typeof UserFormData>;
export type UserDataType = z.infer<typeof baseUserData>;
export type UserModelResponse = z.infer<typeof userDomainResponse>;
