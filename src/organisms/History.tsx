import { atom, useRecoilState } from "recoil";
import { Button, Container, Stack, Box } from "@mui/material";
import { CallMade } from "@mui/icons-material";
import { BoardMarks } from "../organisms/Board";
import { DirectionSwitch, Direction } from "../molecules/DirectionSwitch";

export type Memory = {
  board: BoardMarks;
  position: number;
};
type HistoryProps = {
  history: Memory[];
  turn: number;
  onClick: (i: number) => void;
};
export const directionState = atom<Direction>({
  key: "game/history/direction",
  default: "desc",
});
export const History = (props: HistoryProps) => {
  const [direction, setDirection] = useRecoilState(directionState);
  let moves = props.history.map((item, i) => {
    const description = "turn #" + i + " " + positionStr(item.position);
    const variant = i === props.turn ? "outlined" : "text";
    return (
      <Box key={i}>
        <Button
          startIcon={<CallMade />}
          color="primary"
          variant={variant}
          size="small"
          onClick={() => props.onClick(i)}
        >
          {description}
        </Button>
      </Box>
    );
  });
  if (direction === "asc") moves = moves.reverse();
  return (
    <Stack className="game-history" spacing={1}>
      <Container>
        <DirectionSwitch
          direction={direction}
          onClick={(d) => setDirection(d)}
        />
      </Container>
      <Stack>{moves}</Stack>
    </Stack>
  );
};

function positionStr(i: number) {
  if (i >= 0) {
    return "(" + ((i % 3) + 1) + "," + Math.trunc(i / 3 + 1) + ")";
  } else {
    return "";
  }
}
