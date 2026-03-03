import { useEffect, useState } from 'react';

export const useCurrencyConverter = <T>() => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [data, setDataState] = useState<T>();
  useEffect(() => {
    const controller = new AbortController();

    const handleFetchCurrencyData = async () => {
      try {
        const response = await fetch(
          'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/all.json',
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
        setIsError(true);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    handleFetchCurrencyData();

    return () => {
      controller.abort();
    };
  }, []);
  return { isLoading, isError, data };
};
