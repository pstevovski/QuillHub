/**
 * Utility function that checks if the received error
 * is a valid Error object and if so, extracts only the message of it.
 * In any other potential case we stringify the error and return it as such.
 **/
export default function handleErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  } else {
    return String(error);
  }
}
