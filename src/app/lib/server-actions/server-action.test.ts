import { z } from 'zod';

import { ERROR_CODES, ServerActionError } from './error';
import { createServerAction } from './server-action';
import { getCurrentUserDomain } from '../data/domain/user';
import { requireAuth } from '../auth/server';
import { AdminUser } from '../types';

jest.mock('../data/domain/user', () => ({
  getCurrentUserDomain: jest.fn()
}));

jest.mock('../auth/server', () => ({
  requireAuth: jest.fn()
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

const mockGetCurrentUserDomain = getCurrentUserDomain as jest.MockedFunction<
  typeof getCurrentUserDomain
>;

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock requireAuth to return a valid user
    mockRequireAuth.mockResolvedValue({
      uid: 'test-user-id',
      email: 'test@example.com',
      aud: 'test',
      auth_time: 0,
      exp: 0,
      firebase: {
        identities: {},
        sign_in_provider: 'test'
      },
      iat: 0,
      iss: 'test',
      sub: 'test-user-id'
    });

    // Mock getCurrentUserDomain to return user data
    mockGetCurrentUserDomain.mockResolvedValue({
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'admin'
    } as AdminUser);
  });

  it('should return passed value, no input validation', async () => {
    const schema = z.object({
      name: z.string()
    });

    const action = createServerAction()
      .input(schema)
      .handler(async ({ input }) => {
        return input;
      });

    const response = await action({ name: 'test' });

    expect(response).toEqual({
      name: 'test'
    });
  });

  it("should throw error if input data doesn't comply with input schema", async () => {
    const schema = z.object({
      name: z.string().max(2)
    });

    const action = createServerAction()
      .input(schema)
      .withAuth()
      .handler(async ({ input }) => {
        return input;
      });

    await expect(action({ name: 'test' })).rejects.toThrow(ServerActionError);
    await expect(action({ name: 'test' })).rejects.toMatchObject({
      code: ERROR_CODES.VALIDATION_ERROR
    });
  });

  it('should return input data if input data complies with input schema', async () => {
    const schema = z.object({
      name: z.string()
    });

    const action = createServerAction()
      .input(schema)
      .handler(async ({ input }) => {
        return input;
      });

    const response = await action({ name: 'test' });

    expect(response).toEqual({
      name: 'test'
    });
  });

  it("should throw error if output data doesn't comply with output schema", async () => {
    const schema = z.object({
      test: z.string().max(2)
    });

    const action = createServerAction()
      .input(z.void())
      .output(schema)
      .handler(async () => {
        return { test: 'test' };
      });

    await expect(action()).rejects.toThrow(ServerActionError);
    await expect(action()).rejects.toMatchObject({
      code: ERROR_CODES.VALIDATION_ERROR
    });
  });

  it('should return input data if input data complies with schema', async () => {
    const schema = z.object({
      name: z.string()
    });

    const action = createServerAction()
      .input(schema)
      .output(schema)
      .handler(async ({ input }) => {
        return input;
      });

    const response = await action({ name: 'test' });

    expect(response).toEqual({
      name: 'test'
    });
  });

  it('should throw an internal server error if the handler function throws', async () => {
    const action = createServerAction()
      .input(z.void())
      .handler(async () => {
        throw new Error('test');
      });

    await expect(action()).rejects.toThrow(ServerActionError);
    await expect(action()).rejects.toMatchObject({
      code: ERROR_CODES.INTERNAL_SERVER_ERROR
    });
  });

  it('should throw not authorized error if the user call fails', async () => {
    mockGetCurrentUserDomain.mockRejectedValue(new Error('test'));

    const action = createServerAction()
      .input(z.void())
      .withAuth()
      .handler(async () => {
        return {};
      });

    await expect(action()).rejects.toThrow(ServerActionError);
    await expect(action()).rejects.toMatchObject({
      code: ERROR_CODES.NOT_AUTHORIZED
    });
  });

  it('should throw not authorized error if the user is not authenticated', async () => {
    mockGetCurrentUserDomain.mockResolvedValue(null);

    const action = createServerAction()
      .input(z.void())
      .withAuth()
      .handler(async () => {
        return {};
      });

    await expect(action()).rejects.toThrow(ServerActionError);
    await expect(action()).rejects.toMatchObject({
      code: ERROR_CODES.NOT_AUTHORIZED
    });
  });

  it('should be able to access user info if the user is authenticated', async () => {
    const user = {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'admin'
    };

    mockGetCurrentUserDomain.mockResolvedValue(user as AdminUser);

    const action = createServerAction()
      .input(z.void())
      .withAuth()
      .handler(async ({ ctx }) => {
        return ctx.user;
      });

    const response = await action();
    expect(response).toStrictEqual(user);
  });

  it('should return undefined if user is not logged in for optional=true on withAuth', async () => {
    mockGetCurrentUserDomain.mockRejectedValue(new Error('No user'));

    const action = createServerAction()
      .input(z.void())
      .withAuth({ optional: true })
      .handler(async ({ ctx }) => {
        return ctx.user;
      });

    const response = await action();
    expect(response).toBeUndefined();
  });

  it('should return the logged in user with withAuth and optional=true', async () => {
    const user = {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'admin'
    };

    mockGetCurrentUserDomain.mockResolvedValue(user as AdminUser);

    const action = createServerAction()
      .input(z.void())
      .withAuth({ optional: true })
      .handler(async ({ ctx }) => {
        return ctx.user;
      });

    const response = await action();
    expect(response).toStrictEqual(user);
  });

  it('should throw NOT_AUTHORIZED if user is not logged in for optional=false on withAuth', async () => {
    mockGetCurrentUserDomain.mockResolvedValue(null);

    const action = createServerAction()
      .input(z.void())
      .withAuth({ optional: false })
      .handler(async ({ ctx }) => {
        return ctx.user;
      });

    await expect(action()).rejects.toThrow(ServerActionError);
    await expect(action()).rejects.toMatchObject({
      code: ERROR_CODES.NOT_AUTHORIZED
    });
  });

  it('should be able to access ctx in output method', async () => {
    const user = {
      id: 'test-user-id',
      email: 'test@example.com',
      role: 'admin'
    };

    mockGetCurrentUserDomain.mockResolvedValue(user as AdminUser);

    const func = jest.fn();
    const action = createServerAction()
      .input(z.void())
      .withAuth()
      .output(({ ctx }) => {
        func(ctx.user);
        return z.object({});
      })
      .handler(async () => {
        return {};
      });

    await action();

    expect(func).toHaveBeenCalledWith(user);
  });
});
