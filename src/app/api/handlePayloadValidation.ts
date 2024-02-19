import { ZodSchema } from "zod";
import { ApiErrorMessage } from "./handleApiError";

/**
 *
 * Utility function that will validate the
 * received payload against a specific pre-defined
 * Zod validation schema.
 *
 * If validation fails, it throws an error that will then be
 * catched by the Route Handler's `catch` block, responding
 * with the correct error message and status code.
 *
 * @param schema Zod validation schema that we want to check against
 * @param payload Received request payload
 *
 * @returns Throws an error or returns `true` to continue route handler execution
 *
 */
export async function handlePayloadValidation(
  schema: ZodSchema,
  payload: unknown
) {
  const { success } = await schema.safeParseAsync(payload);

  if (!success) throw new Error(ApiErrorMessage.INVALID_VALUES);

  return true;
}
