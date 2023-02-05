import { Slide, useTheme } from "@mui/material";
import styled from "styled-components";
import { FC } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const StyledSlide = styled(Slide)`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  backdrop-filter: blur(5px);
  background-color: rgba(18, 18, 18, 0.4);
  padding: ${({ theme }) => theme.spacing(2)} 0;
  z-index: 1;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const BottomBar: FC<{ show: boolean; children: ReactJSXElement }> = ({ show, children }) => {
  const theme = useTheme();
  return (
    <StyledSlide className="bottom-bar" direction="up" in={show} theme={theme}>
      <ButtonsContainer>{children}</ButtonsContainer>
    </StyledSlide>
  );
};

export default BottomBar;
