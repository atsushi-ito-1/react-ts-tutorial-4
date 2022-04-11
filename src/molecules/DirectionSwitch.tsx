import { ToggleButton, ToggleButtonGroup, Tooltip } from "@mui/material";
import {
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";

export type Direction = "desc" | "asc";
type DirectionSwitchProps = {
  direction: Direction;
  onClick: (direction: Direction) => void;
};
export const DirectionSwitch = (props: DirectionSwitchProps) => {
  const changeDirection = (
    event: React.MouseEvent<HTMLElement>,
    d: Direction
  ) => {
    props.onClick(d);
  };
  return (
    <ToggleButtonGroup
      value={props.direction}
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
