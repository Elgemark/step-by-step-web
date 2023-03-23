import styled from "styled-components";
import { useTheme } from "@mui/material";
import { useScrollDirection } from "../../hooks/scroll";

const Root = styled.div`
  position: sticky;
  top: 70px;
  z-index: 1;

  display: flex;
  justify-content: center;
  align-self: center;
`;

const ContentContainer = styled.div`
  backdrop-filter: blur(20px);
  border-radius: ${({ theme }) => theme.spacing(2)};
  padding: ${({ theme }) => theme.spacing(1)};
  margin: ${({ theme }) => theme.spacing(1)} 0 ${({ theme }) => theme.spacing(2)};
  transform: scale(${({ scrollDirection }) => (scrollDirection === "down" ? 0.8 : 1)});
  transform-origin: top center;
  transition: 0.5s transform;
  :hover {
    transform: scale(1);
  }
`;

const FloatingTopBar = ({ children, ...props }) => {
  const theme = useTheme();
  const scrollDirection = useScrollDirection();

  return (
    <Root theme={theme} {...props}>
      <ContentContainer scrollDirection={scrollDirection} theme={theme}>
        {children}
      </ContentContainer>
    </Root>
  );
};

export default FloatingTopBar;
