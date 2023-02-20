import { useEffect, useState } from "react";

export * as worker from "./worker";
export * as sentry from "./sentry";
export { theme } from "./theme";
export * as analytics from "./analytics";
export * as env from "./env";

export function useDebounced<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
