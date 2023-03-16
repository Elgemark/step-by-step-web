import { Collapse, Divider, useTheme } from "@mui/material";
import { useRef } from "react";
import { FC } from "react";
import IconSteppoCheckColor from "./primitives/IconSteppoCheckColor";
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
}> = ({ open = false, scrollIntoViewTimeout = 500, onClickRate }) => {
  const ref = useRef<HTMLInputElement>(null);
  const theme = useTheme();

  const onEndHandler = () => {
    setTimeout(() => {
      ref.current.scrollIntoView({
        behavior: "smooth",
      });
    }, scrollIntoViewTimeout);
  };
  return (
    <Collapse ref={ref} in={open} addEndListener={onEndHandler}>
      <StyledInnerContainer theme={theme}>
        <IconSteppoCheckColor className="icon-complete" fontSize="large" />
        <Divider />
        <Rate value={0} onClick={onClickRate} />
      </StyledInnerContainer>
    </Collapse>
  );
};

export default StepsDone;
