import { handleCheckWin } from '../lib/handleCheckWin';
import type { boardType, gameStatus, turnType } from '../model/types';
import styles from '../style/TicTacToe.module.css';
import { useState } from 'react';

interface gameInfo {
  board: boardType[][];
  gameStatus: gameStatus;
  turn: turnType;
  capacity: number;
}

function TicTacToePage() {
  const defaultGameState: gameInfo = {
    board: Array.from({ length: 3 }, () => {
      return Array.from({ length: 3 }, () => null as boardType);
    }),
    gameStatus: 'process',
    turn: 'X',
    capacity: 0,
  };
  const [game, setGame] = useState<gameInfo>(defaultGameState);

  const handleClickCell = (row: number, column: number) => {
    setGame((prev) => {
      const nextTurn = prev.turn === 'X' ? 'O' : 'X';
      const newBoard = prev.board.map((rowArr, r) =>
        r === row
          ? rowArr.map((cell, c) => (c === column ? prev.turn : cell))
          : rowArr
      );
      const newCapacity = prev.capacity + 1;
      let newGameStatus = prev.gameStatus;
      const whoWin = handleCheckWin(newBoard);
      if (newCapacity === 9 && whoWin === null) {
        newGameStatus = 'draw' as gameStatus;
      }
      if (whoWin != null) {
        newGameStatus = whoWin as gameStatus;
      }
      return {
        turn: nextTurn,
        board: newBoard,
        gameStatus: newGameStatus,
        capacity: newCapacity,
      };
    });
  };

  const handleClickReset = () => {
    setGame(defaultGameState);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.header}>Tic-Tac-Toe</h1>
      <h3 className={styles.playerTurn}>
        {game.gameStatus === 'process' ? (
          <>
            Next player: <span>{game.turn}</span>
          </>
        ) : game.gameStatus === 'draw' ? (
          <>The result is draw!</>
        ) : (
          <>The winner {game.turn === 'X' ? 'O' : 'X'}</>
        )}
      </h3>
      <div className={styles.board}>
        {game.board.flat().map((cell, cellIndex) => {
          const row = Math.floor(cellIndex / 3);
          const column = cellIndex % 3;
          return (
            <button
              type="button"
              key={`cell-${cellIndex}`}
              className={`${styles.boardCell} ${styles.button}`}
              disabled={
                game.board[row][column] !== null ||
                game.gameStatus !== 'process'
              }
              onClick={() => handleClickCell(row, column)}
            >
              {!cell ? '' : cell}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        className={`${styles.resetButton} ${styles.button}`}
        onClick={handleClickReset}
      >
        Reset Game
      </button>
    </main>
  );
}

export default TicTacToePage;
