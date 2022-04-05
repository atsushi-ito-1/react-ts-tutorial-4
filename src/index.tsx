import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {Button, Radio, RadioGroup } from "@mui/material";
import CallMade from "@mui/icons-material/CallMade.js";


type SquareState = "O" | "X" | null;
type SquareType = "square" | "square good-square";
type SquareProps = {
  value: SquareState;
  type: SquareType;
  onClick: () => void;
};
const Square = (props: SquareProps) => (
  <button className={props.type} onClick={props.onClick}>
    {props.value}
  </button>
);

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
    let type: SquareType = "square";
    if (pieces && pieces.includes(i)) type = "square good-square";
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        type={type}
        key={i}
      />
    );
  };
  const renderRow = (y: number, pieces: Pieces) => {
    const row = [];
    for (let x = 0; x < 3; x++) {
      row.push(renderSquare(y * 3 + x, pieces));
    }
    return (
      <div className="board-row" key={y}>
        {row}
      </div>
    );
  };
  let pieces: Pieces = null;
  const winnerState = winner(props.squares);
  if (winnerState) pieces = winnerState.pieces;
  const board = [];
  for (let y = 0; y < 3; y++) {
    board.push(renderRow(y, pieces));
  }
  return <div>{board}</div>;
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
  const squares = history[turn].squares;
  const status = statusLine(squares, turn);
  let moves = history.map((item, i) => {
    const description = "turn #" + i;
    const position = positionStr(item.position);
    const current = i === turn ? "current-turn" : "other-turn";
    const variant = i === turn ? "outlined" : "text";
    return (
      <li key={i}>
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
      </li>
    );
  });
  if (direction === "asc") moves = moves.reverse();
  const directionButton = (d: Direction) => (
    <Radio
      name="direction"
      value={direction}
      checked={direction === d}
      onChange={() => setDirection(d)}
    />
  );
  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onClick={(i) => handleClick(i)} />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <RadioGroup row defaultValue="desc">
          {directionButton("desc")}↓{directionButton("asc")}↑
        </RadioGroup>
        <ul>{moves}</ul>
      </div>
    </div>
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
