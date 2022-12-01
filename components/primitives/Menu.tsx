import MUIMenu from "@mui/material/Menu";
import { alpha } from "@mui/material/styles";
import styled from "styled-components";

const Menu = styled(MUIMenu)`
  border-radius: 6;
  margin-top: ${({ theme }) => theme.spacing(1)};
  min-width: 180;
  color: ${({ theme }) => (theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300])};
  .MuiMenu-list {
    padding: "4px 0";
  }
  .MuiSvgIcon-root {
    font-size: 18;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-right: ${({ theme }) => theme.spacing(1.5)};
  }
  .MuiSvgIcon-root:active {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)};
  }
`;

export default Menu;
