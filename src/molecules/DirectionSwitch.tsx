import { atom, useRecoilState } from "recoil";
import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";

type Direction = "desc" | "asc";
export const directionAtom = atom<Direction>({
  key: "game/direction",
  default: "desc",
});

export const DirectionSwitch = () => {
  const [direction, setDirection] = useRecoilState(directionAtom);
  const changeDirection = (
    event: React.MouseEvent<HTMLElement>,
    d: Direction
  ) => {
    setDirection(d);
  };
  return (
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
};
