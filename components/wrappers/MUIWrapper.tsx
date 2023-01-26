import { ThemeProvider, createTheme } from "@mui/material/styles";
import { GlobalStyles } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { FC, ReactNode, createContext, useMemo, useState } from "react";
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const MUIWrapper: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  // const { data: user, save: saveUser, update: updateUser, isLoading: isLoadingUser } = useCurrentUser(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");
  // const mode: "dark" | "light" = (!isLoadingUser && user?.theme) || "dark";

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        const newMode = mode === "light" ? "dark" : "light";
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
        // if (user?.id) {
        //   saveUser({ theme: newMode });
        // } else {
        //   updateUser({ theme: newMode });
        // }
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: { backgroundColor: mode === "light" ? "white" : "dark", transition: "1s background-color" },
          }}
        />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default MUIWrapper;
