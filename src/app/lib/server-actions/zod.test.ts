import { z, ZodError, ZodSchema } from 'zod';
import { ServerActionError } from './error';
import { clientServerActionErrorParser, validateZodSchema } from './zod';

type CaseType = {
  testName: string;
  schema: ZodSchema;
  input: unknown;
  expected: string;
};

const cases: CaseType[] = [
  {
    testName: 'parses one error to a string',
    schema: z.object({
      name: z.string()
    }),
    input: 'test',
    expected: `Expected object, received string at "root";`
  },
  {
    testName: 'parses multiple errors to a string',
    schema: z.object({
      name: z.string(),
      age: z.number().gte(18)
    }),
    input: {
      name: 'test',
      age: 17
    },
    expected: `Number must be greater than or equal to 18 at "age";`
  },
  {
    testName: 'parses nested errors to a string',
    schema: z.object({
      name: z.string(),
      address: z.object({
        street: z.object({
          name: z.string()
        }),
        number: z.number()
      })
    }),
    input: {
      name: 'test',
      address: {
        street: {
          name: {}
        },
        number: '1'
      }
    },
    expected: `Expected string, received object at "address.street.name"; Expected number, received string at "address.number";`
  }
];

describe('clientServerActionErrorParser', () => {
  cases.forEach(({ testName, schema, input, expected }) => {
    it(testName, () => {
      const parsed = schema.safeParse(input);
      expect(parsed.success).toBe(false);
      const parsedError = clientServerActionErrorParser(
        parsed.error as ZodError
      );
      expect(parsedError).toBe(expected);
    });
  });
});

describe('validateZodSchema', () => {
  it('throw validation error if validation fails', async () => {
    const schema = z.object({
      name: z.string()
    });

    const data = 'test';
    await expect(validateZodSchema(schema, data)).rejects.toThrow(
      ServerActionError
    );
  });
  it('return data if validation passes', async () => {
    const schema = z.object({
      name: z.string()
    });

    const data = { name: 'test' };
    await expect(validateZodSchema(schema, data)).resolves.toEqual(data);
  });
});
