export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const MAX_IMAGE_SIZE = 5; // MB

/** Utility function that will convert the selected file's size from `bytes` to `megabytes`. */
export function convertFileSize(
  bytes: number,
  decimalPoints: number = 2
): number {
  const convertToMB = bytes / (1024 * 1024);
  return +convertToMB.toFixed(decimalPoints);
}
