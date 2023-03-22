import styled from "styled-components";
import { useTheme } from "@mui/material";

const Root = styled.div`
  position: sticky;
  top: 70px;
  z-index: 1;
  backdrop-filter: blur(20px);
  border-radius: ${({ theme }) => theme.spacing(2)};
`;

const FloatingTopBar = (props) => {
  const theme = useTheme();

  return <Root theme={theme} {...props}></Root>;
};

export default FloatingTopBar;
