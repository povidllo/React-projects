import { useEffect, useState } from 'react';

export const useCurrencyNames = <T>() => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setDataState] = useState<T>();

  useEffect(() => {
    const controller = new AbortController();

    const hadleFetchCurrencyNames = async () => {
      try {
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json',
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error('not okey response');
        }
        const responseData = await response.json();
        console.log(responseData);
        setDataState(responseData);
      } catch (error) {
        if (error.name === 'AbortError') {
          return;
        }
        console.log(error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    hadleFetchCurrencyNames();

    return () => {
      controller.abort();
    };
  }, []);

  return { isLoading, isError, data };
};
