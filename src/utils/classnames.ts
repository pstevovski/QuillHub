import clsx from "clsx";
import { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility function for merging tailwind classess preventing conflicts caused by order */
export default function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
