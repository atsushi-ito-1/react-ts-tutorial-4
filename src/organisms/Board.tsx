import { Grid } from "@mui/material";
import { Square, SquareState } from "../atoms/Square";

export type BoardState = [
  SquareState,
  SquareState,
  SquareState,
  SquareState,
  SquareState,
  SquareState,
  SquareState,
  SquareState,
  SquareState
];
type BoardProps = {
  board: BoardState;
  onClick: (i: number) => void;
};
export const Board = (props: BoardProps) => {
  const renderSquare = (i: number, pieces: Pieces) => {
    const isConnected = pieces !== null && pieces.includes(i);
    return (
      <Grid item xs={4}>
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
  const winnerState = winner(props.board);
  if (winnerState) pieces = winnerState.pieces;
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
export type WinnerState = {
  name: SquareState;
  pieces: Pieces;
} | null;
export function winner(board: BoardState): WinnerState {
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

export function isDraw(board: BoardState) {
  for (const square of board) {
    if (!square) return false;
  }
  return true;
}
