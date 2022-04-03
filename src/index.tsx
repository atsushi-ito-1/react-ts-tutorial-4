import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

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
type GameState = {
  history: OneHistory[];
  turn: number;
  direction: Direction;
};
class Game extends React.Component<GameProps, GameState> {
  constructor(props: GameProps) {
    super(props);
    this.state = {
      history: [
        {
          squares: [null, null, null, null, null, null, null, null, null],
          position: -1,
        },
      ],
      turn: 0,
      direction: "desc",
    };
  }
  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.turn + 1);
    const squares = last(history).squares.slice();
    if (winner(squares) || squares[i]) return;
    squares[i] = pieceMark(this.state.turn);
    this.setState({
      history: history.concat([{ squares, position: i }]),
      turn: this.state.turn + 1,
    });
  }
  jumpTo(turn: number) {
    this.setState({ turn });
  }
  render() {
    const history = this.state.history;
    const squares = history[this.state.turn].squares;
    const status = statusLine(squares, this.state.turn);
    let moves = history.map((item, turn) => {
      const description = "Go to turn #" + turn;
      const position = positionStr(item.position);
      const current = turn === this.state.turn ? "current-turn" : "other-turn";
      return (
        <li key={turn}>
          <button onClick={() => this.jumpTo(turn)} className={current}>
            {description} {position}
          </button>
        </li>
      );
    });
    if (this.state.direction === "asc") moves = moves.reverse();
    const directionButton = (direction: Direction) => (
      <input
        type="radio"
        name="direction"
        value={direction}
        checked={this.state.direction === direction}
        onChange={() => this.setState({ direction: direction })}
      />
    );
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            {directionButton("desc")}↓{directionButton("asc")}↑
          </div>
          <ul>{moves}</ul>
        </div>
      </div>
    );
  }
}

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
  const winnerState: WinnerState = winner(squares);
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
