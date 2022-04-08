import { Box, Typography } from "@mui/material";

export type SquareState = "O" | "X" | null;
type SquareProps = {
  state: SquareState;
  isConnected: boolean;
  onClick: () => void;
};
export const Square = (props: SquareProps) => {
  const background = props.isConnected ? "gold" : "white";
  return (
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
      <Typography variant="h4" color="secondary">
        {props.state}
      </Typography>
    </Box>
  );
};
