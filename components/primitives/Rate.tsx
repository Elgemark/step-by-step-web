import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { IconButton, Stack } from "@mui/material";
import { FC } from "react";
import styled from "styled-components";

export type StarType = "empty" | "half" | "full";

const icons = { empty: StarBorderIcon, half: StarHalfIcon, full: StarIcon };

const StarButton: FC<{ type: StarType; onClick: () => void }> = ({ type = "empty", onClick, ...rest }) => {
  const Icon = icons[type];

  return (
    <IconButton onClick={onClick} {...rest}>
      <Icon />
    </IconButton>
  );
};

const StyledStarButton = styled(StarButton)``;

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

const getStarButton = (value: number, starValue: number, onClick: Function) => {
  return (
    <StyledStarButton
      type={getStarType(value, starValue)}
      onClick={() => onClick && onClick(starValue)}
      clickable={Boolean(onClick)}
    />
  );
};

const Rate: FC<{ value: number; onClick?: (value: number) => void }> = ({ value = 0, onClick }) => {
  const starButtons = [];
  for (let index = 0; index < 5; index++) {
    starButtons.push(getStarButton(value, index + 1, onClick));
  }

  return (
    <Stack direction={"row"} spacing={0}>
      {starButtons}
    </Stack>
  );
};

export default Rate;
