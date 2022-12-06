import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFFFF",
    },
  },
  // components: {
  //   MuiAppBar: {
  //     styleOverrides: {
  //       colorPrimary: {
  //         backgroundColor: "red",
  //       },
  //     },
  //   },
  // },
});
export default theme;
