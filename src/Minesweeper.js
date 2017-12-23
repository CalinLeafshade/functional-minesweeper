import range from "lodash/range";
import random from "lodash/random";
import uniq from "lodash/uniq";

export const createArray = (width, height) =>
  range(width).map(x => range(height).map(x => false));

export const width = board => board[0].length;
export const height = board => board.length;

export const randomCoords = board => [
  random(height(board) - 1),
  random(width(board) - 1)
];

export const populateBoard = (board, count) => {
  if (count > 0) {
    return populateBoard(addBomb(board), count - 1);
  } else {
    return board;
  }
};

export const addBomb = board => {
  let [row, col] = randomCoords(board);
  while (board[row][col]) {
    [row, col] = randomCoords(board);
  }
  const newBoard = board.map(a => a.slice());
  newBoard[row][col] = true;
  return newBoard;
};

export const isValidCoord = (board, row, col) =>
  row > -1 && col > -1 && col < width(board) && row < height(board);

const isExposed = (exposed, row, col) =>
  exposed.find(t => t[0] === row && t[1] === col);

export const expose = (board, exposed, row, col) => {
  const pass = (row, col) => {
    if (!isExposed(exposed, row, col)) {
      exposed.push([row, col]);

      if (neighbourMineCount(board, row, col) === 0) {
        neighbours(board, row, col)
          .filter(a => isValidCoord(board, a[0], a[1]))
          .forEach(a => pass(a[0], a[1]));
      }
    }
  };

  if (!board[row][col] && neighbourMineCount(board, row, col) === 0) {
    pass(row, col);
  } else {
    exposed.push([row, col]);
  }
  return uniq(exposed);
};

export const neighbours = (board, row, col) =>
  [
    [row + 1, col],
    [row - 1, col],
    [row, col + 1],
    [row, col - 1],
    [row - 1, col - 1],
    [row + 1, col + 1],
    [row + 1, col - 1],
    [row - 1, col + 1]
  ].filter(a => isValidCoord(board, a[0], a[1]));

export const neighbourMineCount = (board, row, col) =>
  neighbours(board, row, col)
    .map(([row, col]) => board[row][col])
    .filter(x => x).length;

export const createBoard = (width, height, count) =>
  populateBoard(createArray(width, height), count);
