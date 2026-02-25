import { useEffect, useMemo, useState } from 'react';
import { useCurrencyConverter } from '../api/useCurrencyConverter';
import { useCurrencyNames } from '../api/useCurrencyNames';
import { convertVelues } from '../lib/convertValues';
import { ArrowDown } from 'lucide-react';
import styles from '../style/CurrencyConverter.module.css';

interface CurrencyRates {
  [currencyCode: string]: number;
}

interface CurrencyExchage {
  date: string;
  all: CurrencyRates | string;
}

interface CurrencyNames {
  [currencyCode: string]: string;
}

interface CurrentCurrency {
  firstName: string;
  firstValue: string;
  secondName: string;
  secondValue: string;
}

function CurrencyConverterPage() {
  const [currentCurrency, setCurrentCurrency] = useState<CurrentCurrency>({
    firstName: '',
    firstValue: '',
    secondName: '',
    secondValue: '',
  });

  const {
    data: allCurrency,
    isLoading: currencyLoading,
    isError: currencyError,
  } = useCurrencyConverter<CurrencyExchage>();

  const {
    data: allCurrencyNames,
    isLoading: currencyNamesLoading,
    isError: currencyNamesError,
  } = useCurrencyNames<CurrencyNames>();

  const handleSetCurrentCurrency = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof CurrentCurrency
  ) => {
    const newValue = event.target.value;
    setCurrentCurrency((prev) => {
      const newState = { ...prev, [field]: newValue };

      const { firstName, secondName, firstValue, secondValue } = newState;
      if (!allCurrency?.all || !firstName || !secondName) return newState;

      const from = Number(allCurrency.all[firstName]);
      const to = Number(allCurrency.all[secondName]);

      if (field === 'firstValue' || field === 'firstName') {
        if (Number(newValue) < 0) {
          return prev;
        }
        newState.secondValue =
          firstValue && from && to
            ? String(convertVelues(Number(firstValue), from, to))
            : '';
      } else if (field === 'secondValue' || field === 'secondName') {
        if (Number(newValue) < 0) {
          return prev;
        }
        newState.firstValue =
          secondValue && from && to
            ? String(convertVelues(Number(secondValue), to, from))
            : '';
      }
      return newState;
    });
  };

  const currencyOptions = useMemo(() => {
    if (!allCurrencyNames) return [];
    return Object.entries(allCurrencyNames).map(([code, name]) => (
      <option key={code} value={code}>
        {name || code}
      </option>
    ));
  }, [allCurrencyNames]);

  if (currencyLoading || currencyNamesLoading) {
    return <div>Loading...</div>;
  }

  if (currencyError || currencyNamesError) {
    return <div>Error</div>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1>Currency converter</h1>
        <h3>Today: {allCurrency?.date}</h3>
        <div className={styles.currencyContainer}>
          <div className={styles.currencyWrapper}>
            <input
              id="first-value-id"
              type="number"
              value={currentCurrency.firstValue}
              onChange={(e) => {
                handleSetCurrentCurrency(e, 'firstValue');
              }}
              className={`${styles.currencyInput}`}
            ></input>
            <select
              id="first-name-id"
              value={currentCurrency.firstName}
              onChange={(e) => {
                handleSetCurrentCurrency(e, 'firstName');
              }}
              className={`${styles.currency} ${styles.currencySelect}`}
            >
              <option value="">Select currency</option>
              {currencyOptions}
            </select>
          </div>
          <ArrowDown strokeWidth="2px" className={styles.arrow} />
          <div className={styles.currencyWrapper}>
            <input
              id="second-value-id"
              type="number"
              value={currentCurrency.secondValue}
              onChange={(e) => {
                handleSetCurrentCurrency(e, 'secondValue');
              }}
              className={`${styles.currencyInput}`}
            ></input>
            <select
              id="second-name"
              value={currentCurrency.secondName}
              onChange={(e) => {
                handleSetCurrentCurrency(e, 'secondName');
              }}
              className={`${styles.currencySelect}`}
            >
              <option value="">Select currency</option>
              {allCurrencyNames &&
                Object.entries(allCurrencyNames).map(([code, name]) =>
                  name !== '' ? (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ) : (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  )
                )}
            </select>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CurrencyConverterPage;
