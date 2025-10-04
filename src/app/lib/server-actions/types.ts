import { ZodType } from 'zod';

// Simple types for server actions
export type Ctx = {
  headers: Record<string, string>;
};

export type AuthCtx = Ctx & {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'agent' | 'user';
  };
};

export type WithAuthOptionsType = {
  optional: boolean;
};
