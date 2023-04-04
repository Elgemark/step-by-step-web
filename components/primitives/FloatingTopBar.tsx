import styled from "styled-components";
import { useTheme } from "@mui/material";
import { useScrollDirection } from "../../hooks/scroll";
import { FC } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const Root = styled.div`
  position: sticky;
  top: 70px;
  z-index: 1;

  display: flex;
  justify-content: center;
  align-self: center;
`;

const ContentContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border-radius: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(1)};
  margin: ${({ theme }) => theme.spacing(0.5)} 0 ${({ theme }) => theme.spacing(2)};
  transform: scale(${({ scrollDirection, disableShrink }) => (!disableShrink && scrollDirection === "down" ? 0.8 : 1)});
  transform-origin: top center;
  transition-delay: 1s;
  transition: 0.5s transform;
  :hover {
    transform: scale(1);
  }
`;

const FloatingTopBar: FC<{ disableShrink?: boolean; children: ReactJSXElement; [key: string]: any }> = ({
  disableShrink = false,
  children,
  ...props
}) => {
  const theme = useTheme();
  const scrollDirection = useScrollDirection();

  return (
    <Root theme={theme} {...props}>
      <ContentContainer scrollDirection={scrollDirection} disableShrink={disableShrink} theme={theme}>
        {children}
      </ContentContainer>
    </Root>
  );
};

export default FloatingTopBar;
