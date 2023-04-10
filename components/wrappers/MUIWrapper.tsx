import { ThemeProvider, createTheme } from "@mui/material/styles";
import { GlobalStyles } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { FC, ReactNode, createContext, useMemo, useState } from "react";
import styled from "styled-components";
import Wallpaper from "../primitives/Wallpaper";
export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const WallpaperContainer = styled.div`
  z-index: -1;
  position: fixed;
  width: 100%;
  height: auto;
  /* opacity: 0.5; */
  display: flex;
  justify-content: center;
`;

const StyledWallpaper = styled(Wallpaper)`
  position: absolute;
  width: 140%;
  height: auto;
  max-width: 1100px;
  /* min-width: 540px; */
`;

const MUIWrapper: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  // const { data: user, save: saveUser, update: updateUser, isLoading: isLoadingUser } = useUser(false);
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
          // primary: {
          //   light: "#2277FF",
          //   main: "#0056E0",
          //   dark: "#004ABF",
          // },
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
        <WallpaperContainer>
          <StyledWallpaper />
        </WallpaperContainer>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default MUIWrapper;
