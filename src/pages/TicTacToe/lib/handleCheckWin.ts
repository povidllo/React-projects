import type { boardType } from '../model/types';

export const handleCheckWin = (board: boardType[][]): boardType | null => {
  for (let r = 0; r < 3; r++) {
    if (
      board[r][0] !== null &&
      board[r][0] === board[r][1] &&
      board[r][1] === board[r][2]
    ) {
      return board[r][0];
    }
  }

  for (let c = 0; c < 3; c++) {
    if (
      board[0][c] !== null &&
      board[0][c] === board[1][c] &&
      board[1][c] === board[2][c]
    ) {
      return board[0][c];
    }
  }

  if (
    board[0][0] !== null &&
    board[0][0] === board[1][1] &&
    board[1][1] === board[2][2]
  ) {
    return board[0][0];
  }

  if (
    board[0][2] !== null &&
    board[0][2] === board[1][1] &&
    board[1][1] === board[2][0]
  ) {
    return board[0][2];
  }

  return null;
};
