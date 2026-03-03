import styles from '../style/MainPage.module.css';

import { Link } from 'react-router-dom';

function MainPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.greeting}>
          Добро пожаловать на главную страницу
        </h1>
        <div className={styles.routesList}>
          <h3>Все что есть:</h3>
          <ul>
            <li>
              <button>
                <Link className={styles.routeLink} to={'/tictactoe'}>
                  TicTacToe
                </Link>
              </button>
              <p>Игра в крестики-нолики</p>
            </li>
            <li>
              <button>
                <Link className={styles.routeLink} to={'/currency-converter'}>
                  Currency converter
                </Link>
              </button>
              <p>Конвертер валют</p>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default MainPage;
