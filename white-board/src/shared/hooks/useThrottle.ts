import { useCallback, useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useThrottle = <T extends (...args: any[]) => void>(
  fn: T,
  delay: number
) => {
  const lastTimeRef = useRef<number>(0);
  const callbackRef = useRef<T>(fn);

  useEffect(() => {
    callbackRef.current = fn;
  }, [fn]);

  const throttledFunc = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastTimeRef.current > delay) {
        lastTimeRef.current = now;
        callbackRef.current(...args);
      }
    },
    [delay]
  );

  return throttledFunc;
};
