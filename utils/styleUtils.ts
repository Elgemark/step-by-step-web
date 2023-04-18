import { css } from "styled-components";
import { alpha } from "@mui/material";

export const backgroundBlurMixin = css`
  background-color: ${({ theme }) => alpha(theme.palette.background.paper, 0.35)};
  backdrop-filter: blur(20px);
`;
