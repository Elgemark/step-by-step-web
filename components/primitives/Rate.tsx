import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { IconButton, Stack } from "@mui/material";
import { FC } from "react";
import styled from "styled-components";

export type StarType = "empty" | "half" | "full";

const icons = { empty: StarBorderIcon, half: StarHalfIcon, full: StarIcon };

const StarButton: FC<{ type: StarType; onClick: () => void; size?: "small" | "medium" | "large" }> = ({
  type = "empty",
  size = "medium",
  onClick,
  ...rest
}) => {
  const Icon = icons[type];

  return (
    <IconButton onClick={onClick} {...rest} size={size}>
      <Icon fontSize={size} />
    </IconButton>
  );
};

const StyledStarButton = styled(StarButton)`
  opacity: ${({ type }) => (type === "empty" ? 0.5 : 1)};
  cursor: ${({ clickable }) => (clickable ? "pointer" : "auto")};
`;

const getStarType = (value: number, starValue: number) => {
  const floorValue = starValue - 1;
  const ceilValue = starValue;

  if (value > floorValue && value < ceilValue) {
    return "half";
  } else if (value >= ceilValue) {
    return "full";
  } else {
    return "empty";
  }
};

const getStarButton = (value: number, starValue: number, onClick: Function, size?: "small" | "medium" | "large") => {
  const type = getStarType(value, starValue);
  return (
    <StyledStarButton
      type={type}
      onClick={() => onClick && onClick(starValue)}
      clickable={Boolean(onClick)}
      size={size}
      disableRipple={Boolean(!onClick)}
      disableTouchRipple={Boolean(!onClick)}
      disableFocusRipple={Boolean(!onClick)}
    />
  );
};

const Rate: FC<{
  value: number;
  spacing?: number;
  size?: "small" | "medium" | "large";
  onClick?: (value: number) => void;
}> = ({ value = 0, spacing = 0, size = "medium", onClick }) => {
  const starButtons = [];
  for (let index = 0; index < 5; index++) {
    starButtons.push(getStarButton(value, index + 1, onClick, size));
  }

  return (
    <Stack direction={"row"} spacing={spacing} className="rate">
      {starButtons}
    </Stack>
  );
};

export default Rate;
