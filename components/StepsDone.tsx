import { Collapse, Divider, Typography, useTheme } from "@mui/material";
import { useRef } from "react";
import { FC } from "react";
import IconSteppoCheckColor from "./primitives/IconCheck";
import styled from "styled-components";
import Rate from "./primitives/Rate";

const StyledInnerContainer = styled.div`
  padding: ${({ theme }) => theme.spacing(3)} 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .MuiDivider-root {
    margin: ${({ theme }) => theme.spacing(3)} 0;
    width: 100%;
  }
`;

const StepsDone: FC<{
  open: boolean;
  scrollIntoViewTimeout?: number;
  onClickRate?: (value) => void;
  rateValue?: number;
  rateLabel?: string;
}> = ({ open = false, scrollIntoViewTimeout = 500, onClickRate, rateValue = 0, rateLabel = "Feel free to rate!" }) => {
  const ref = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const onEndHandler = () => {
    setTimeout(() => {
      ref.current.scrollIntoView({
        behavior: "smooth",
      });
    }, scrollIntoViewTimeout);
  };

  const onClickRateHandler = (value) => {
    onClickRate && onClickRate(value);
  };
  return (
    <Collapse ref={ref} in={open} addEndListener={onEndHandler}>
      <StyledInnerContainer theme={theme}>
        <IconSteppoCheckColor className="icon-complete" fontSize="large" />
        <Divider />
        <Collapse in={rateValue < 1}>
          <Typography variant="subtitle2">{rateLabel}</Typography>
        </Collapse>
        <Rate value={rateValue} onClick={onClickRateHandler} size="large" />
      </StyledInnerContainer>
    </Collapse>
  );
};

export default StepsDone;
