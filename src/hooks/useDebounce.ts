import { useState, useEffect } from "react";

/**
 * Hook for debouncing (delaying) a passed value
 * @param value The updated value that is to be delayed
 * @param delay The amount of delay to apply, expressed in milliseconds
 * @returns The updated value returned after the delay
 */
export default function useDebounce<T>(value: T, delay: number = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set the debounced value after given delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the debounce / timeout
    return () => clearTimeout(handler);
  }, [value]);

  return debouncedValue;
}
