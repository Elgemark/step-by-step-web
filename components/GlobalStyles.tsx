// 1. GlobalStyles.js
import { createStyles } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() =>
  createStyles({
    "@global": {
      html: {
        "scroll-behavior": "smooth",
      },
    },
  })
);

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
