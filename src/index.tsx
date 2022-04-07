import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Tooltip,
  Container,
  Stack,
  Box,
  Grid,
} from "@mui/material";
import {
  AlignHorizontalCenter,
  CallMade,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";

type SquareState = "O" | "X" | null;
type SquareType = "normal" | "connected";
type SquareProps = {
  value: SquareState;
  type: SquareType;
  onClick: () => void;
};
const Square = (props: SquareProps) => {
  const color = props.type === "normal" ? "primary" : "secondary";
  const background = props.type === "normal" ? "white" : "gold";
  return (
    <Grid item xs={4}>
      <Box
        sx={{
          border: "1px solid #999",
          width: 50,
          height: 50,
          background: background,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={props.onClick}
        justifyContent="center"
      >
        <Typography variant="h4" color={color}>
          {props.value}
        </Typography>
      </Box>
    </Grid>
  );
};

type BoardState = [
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
  squares: BoardState;
  onClick: (i: number) => void;
};
const Board = (props: BoardProps) => {
  const renderSquare = (i: number, pieces: Pieces) => {
    let type: SquareType = "normal";
    if (pieces && pieces.includes(i)) type = "connected";
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        type={type}
        key={i}
      />
    );
  };
  let pieces: Pieces = null;
  const winnerState = winner(props.squares);
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

type OneHistory = {
  squares: BoardState;
  position: number;
};
type GameProps = {};
type Direction = "desc" | "asc";
const Game = (props: GameProps) => {
  const initialHistory = [
    {
      squares: [null, null, null, null, null, null, null, null, null],
      position: -1,
    },
  ];
  const [history, setHistory] = useState(initialHistory as OneHistory[]);
  const [turn, setTurn] = useState(0 as number);
  const [direction, setDirection] = useState("desc" as Direction);
  function handleClick(i: number) {
    const subHistory = history.slice(0, turn + 1);
    const squares = last(subHistory).squares.slice();
    if (winner(squares) || squares[i]) return;
    squares[i] = pieceMark(turn);
    setHistory(subHistory.concat([{ squares, position: i }]));
    setTurn(turn + 1);
  }
  function jumpTo(turn: number) {
    setTurn(turn);
  }
  const changeDirection = (
    event: React.MouseEvent<HTMLElement>,
    d: Direction
  ) => {
    setDirection(d);
  };
  const squares = history[turn].squares;
  const status = statusLine(squares, turn);
  let moves = history.map((item, i) => {
    const description = "turn #" + i;
    const position = positionStr(item.position);
    const current = i === turn ? "current-turn" : "other-turn";
    const variant = i === turn ? "outlined" : "text";
    return (
      <Box key={i}>
        <Button
          startIcon={<CallMade />}
          color="primary"
          variant={variant}
          size="small"
          onClick={() => jumpTo(i)}
          className={current}
        >
          {description} {position}
        </Button>
      </Box>
    );
  });
  if (direction === "asc") moves = moves.reverse();
  const directionControl = (
    <ToggleButtonGroup
      value={direction}
      exclusive
      onChange={changeDirection}
      aria-label="direction"
      size="small"
    >
      <ToggleButton value="desc" aria-label="descendant" color="primary">
        <Tooltip title="降順">
          <KeyboardDoubleArrowDown />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="asc" aria-label="ascendant" color="primary">
        <Tooltip title="昇順">
          <KeyboardDoubleArrowUp />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
  return (
    <Stack className="game" direction="row" spacing={2}>
      <Stack className="game-board" spacing={1}>
        <Typography variant="h5">{status}</Typography>
        <Board squares={squares} onClick={(i) => handleClick(i)} />
      </Stack>
      <Stack className="game-info" spacing={1}>
        <Container>{directionControl}</Container>
        <Stack className="game-history">{moves}</Stack>
      </Stack>
    </Stack>
  );
};

ReactDOM.render(<Game />, document.getElementById("root"));

type PieceLine = [number, number, number];
type Pieces = PieceLine | null;
type WinnerState = {
  name: SquareState;
  pieces: Pieces;
} | null;
function winner(squares: SquareState[]): WinnerState {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { name: squares[a], pieces: lines[i] };
    }
  }
  return null;
}

function draw(squares: SquareState[]) {
  for (const square of squares) {
    if (!square) return false;
  }
  return true;
}

function last(array: any[]) {
  return array.slice(-1)[0];
}

function pieceMark(turn: number) {
  return turn % 2 === 0 ? "X" : "O";
}

function statusLine(squares: SquareState[], turn: number) {
  let status;
  const winnerState = winner(squares);
  if (winnerState) {
    status = "Winner: " + winnerState.name;
  } else if (draw(squares)) {
    status = "Draw";
  } else {
    status = "Next player: " + pieceMark(turn);
  }
  return status;
}

function positionStr(i: number) {
  if (i >= 0) {
    return "(" + ((i % 3) + 1) + "," + Math.trunc(i / 3 + 1) + ")";
  } else {
    return "";
  }
}
