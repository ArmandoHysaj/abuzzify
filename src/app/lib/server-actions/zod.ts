import { z, ZodError, ZodType } from 'zod';
import { SERVER_ERROR_CODES, ServerError } from './server-error';

export function clientServerActionErrorParser(error: ZodError): string {
  const fieldMappedErrors = error.issues.reduce((acc, issue) => {
    const field = issue.path?.length ? issue.path.join('.') : 'root';
    const message = issue.message;
    return `${acc} ${message} at "${field}";`;
  }, '');

  return fieldMappedErrors.trim();
}

export async function validateZodSchema<T extends ZodType>(
  schema: T,
  data: unknown
) {
  const parsed = await schema.safeParseAsync(data);
  if (!parsed.success) {
    throw new ServerError(
      SERVER_ERROR_CODES.VALIDATION_ERROR,
      clientServerActionErrorParser(parsed.error)
    );
  }

  return parsed.data as z.infer<T>;
}
