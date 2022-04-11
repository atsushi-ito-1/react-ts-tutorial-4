import { atom, useRecoilState } from "recoil";
import { Typography, Stack } from "@mui/material";
import { Board, BoardState, winner, isDraw } from "../organisms/Board";
import { History, Memory } from "../organisms/History";

const historyAtom = atom<Memory[]>({
  key: "game/history",
  default: [
    {
      board: [null, null, null, null, null, null, null, null, null],
      position: -1,
    },
  ],
});
const turnAtom = atom<number>({
  key: "game/turn",
  default: 0,
});
export const Game = () => {
  const [history, setHistory] = useRecoilState(historyAtom);
  const [turn, setTurn] = useRecoilState(turnAtom);
  function handleBoardClick(i: number) {
    const subHistory = history.slice(0, turn + 1);
    const board: BoardState = [...lastMemory(subHistory).board];
    if (winner(board) || board[i]) return;
    board[i] = pieceMark(turn);
    setHistory(subHistory.concat([{ board, position: i }]));
    setTurn(turn + 1);
  }
  function handleHistoryClick(i: number) {
    setTurn(i);
  }
  const board = history[turn].board;
  const status = statusLine(board, turn);
  return (
    <Stack className="game" direction="row" spacing={2}>
      <Stack className="game-board" spacing={1}>
        <Typography variant="h5">{status}</Typography>
        <Board board={board} onClick={(i) => handleBoardClick(i)} />
      </Stack>
      <History
        history={history}
        turn={turn}
        onClick={(i: number) => handleHistoryClick(i)}
      />
    </Stack>
  );
};

function lastMemory(array: Memory[]): Memory {
  return array.slice(-1)[0];
}

function pieceMark(turn: number) {
  return turn % 2 === 0 ? "X" : "O";
}

function statusLine(board: BoardState, turn: number) {
  let status;
  const winnerState = winner(board);
  if (winnerState) {
    status = "Winner: " + winnerState.name;
  } else if (isDraw(board)) {
    status = "Draw";
  } else {
    status = "Next player: " + pieceMark(turn);
  }
  return status;
}
