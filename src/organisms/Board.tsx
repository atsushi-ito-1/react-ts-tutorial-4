import { Grid } from "@mui/material";
import { Square, SquareMark } from "../atoms/Square";

export type BoardMarks = [
  SquareMark,
  SquareMark,
  SquareMark,
  SquareMark,
  SquareMark,
  SquareMark,
  SquareMark,
  SquareMark,
  SquareMark
];
type BoardProps = {
  board: BoardMarks;
  onClick: (i: number) => void;
};
export const Board = (props: BoardProps) => {
  const renderSquare = (i: number, pieces: Pieces) => {
    const isConnected = pieces !== null && pieces.includes(i);
    return (
      <Grid item xs={4} className="game-board" key={i}>
        <Square
          state={props.board[i]}
          onClick={() => props.onClick(i)}
          isConnected={isConnected}
          key={i}
        />
      </Grid>
    );
  };
  let pieces: Pieces = null;
  const winningCondition = winner(props.board);
  if (winningCondition) pieces = winningCondition.pieces;
  const board = [];
  for (let i = 0; i < 9; i++) {
    board.push(renderSquare(i, pieces));
  }
  return (
    <Grid container width="150px">
      {board}
    </Grid>
  );
};

type PieceLine = [number, number, number];
type Pieces = PieceLine | null;
export type WinningCondition = {
  name: SquareMark;
  pieces: Pieces;
} | null;
export function winner(board: BoardMarks): WinningCondition {
  const lines: PieceLine[] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { name: board[a], pieces: lines[i] };
    }
  }
  return null;
}

export function isDraw(board: BoardMarks) {
  for (const square of board) {
    if (!square) return false;
  }
  return true;
}
