import 'server-only';
import { ZodType } from 'zod';
import { SERVER_ERROR_CODES, ServerError } from './server-error';
import { validateZodSchema } from './zod';
import { AuthCtx, Ctx, WithAuthOptionsType } from './types';
import { getCurrentUserDomain } from '../data/domain/user';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { auth } from '../firestoreConnection';

class ServerAction<
  InputSchema extends ZodType | undefined,
  OutputSchema extends ZodType | undefined,
  Auth extends WithAuthOptionsType | undefined
> {
  private inputSchema: InputSchema;
  private outputSchema: OutputSchema;
  private auth: Auth;

  constructor(
    inputSchema: InputSchema,
    outputSchema: OutputSchema,
    auth: Auth
  ) {
    this.inputSchema = inputSchema;
    this.outputSchema = outputSchema;
    this.auth = auth;
  }

  public input<T extends ZodType>(
    input: T
  ): ServerAction<T, OutputSchema, Auth> {
    return new ServerAction(input, this.outputSchema, this.auth);
  }

  public output<T extends ZodType>(
    output: T
  ): ServerAction<InputSchema, T, Auth> {
    return new ServerAction(this.inputSchema, output, this.auth);
  }

  public withAuth<Optional extends boolean = false>(options?: {
    optional?: Optional;
  }) {
    const auth: { optional: Optional } = {
      optional: (options?.optional ?? false) as Optional
    };

    return new ServerAction<InputSchema, OutputSchema, typeof auth>(
      this.inputSchema,
      this.outputSchema,
      auth
    );
  }

  private async validateInput(input: unknown) {
    if (this.inputSchema) {
      return await validateZodSchema(this.inputSchema, input);
    }
    return input;
  }

  private async validateOutput(output: unknown) {
    if (this.outputSchema) {
      return await validateZodSchema(this.outputSchema, output);
    }
    return output;
  }

  private async getContext(): Promise<AuthCtx> {
    const ctx: Ctx = {
      headers: {}
    };

    if (!this.auth) {
      return ctx;
    }

    if (this.auth.optional) {
      try {
        const user = await this.getUser();
        return { ...ctx, user };
      } catch {
        return ctx;
      }
    }

    const user = await this.getUser();
    return { ...ctx, user };
  }

  private async getUser() {
    try {
      const cookieStore = await cookies();
      const sessionCookie = cookieStore.get('session')?.value;

      if (!sessionCookie || !auth) {
        throw new ServerError(SERVER_ERROR_CODES.NOT_AUTHORIZED, '');
      }

      const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
      const user = await getCurrentUserDomain(decodedClaims.uid);
      
      if (!user) {
        throw new ServerError(SERVER_ERROR_CODES.NOT_AUTHORIZED, '');
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
    } catch {
      throw new ServerError(SERVER_ERROR_CODES.NOT_AUTHORIZED, '');
    }
  }

  public handler<Ret>(
    fn: (v: {
      input: any;
      ctx: AuthCtx;
    }) => Ret
  ) {
    return async (args: unknown) => {
      try {
        const input = await this.validateInput(args);
        const ctx = await this.getContext();
        const result = await Promise.resolve(fn({ input, ctx }));
        return await this.validateOutput(result);
      } catch (error) {
        throw error;
      }
    };
  }
}

export function createServerAction() {
  return new ServerAction(undefined, undefined, undefined);
}
