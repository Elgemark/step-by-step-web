import { Fade, Typography, useTheme } from "@mui/material";
import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import LogoLoader from "./primitives/LogoLoader";
import Portal from "./primitives/Portal";

const Root = styled.div`
  display: flex;
  z-index: 9999;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .message {
    margin-top: ${({ theme }) => theme.spacing(3)};
  }

  position: ${({ fullscreen }) => (fullscreen ? "fixed" : "relative")};
  width: ${({ fullscreen }) => (fullscreen ? "100vw" : "auto")};
  height: ${({ fullscreen }) => (fullscreen ? "100vh" : "auto")};
  top: ${({ fullscreen }) => (fullscreen ? 0 : "auto")};
  left: ${({ fullscreen }) => (fullscreen ? 0 : "auto")};
  background-color: ${({ fullscreen }) => (fullscreen ? "rgba(0,0,0,0.8)" : "transparent")};
`;

const Loader: FC<{ message?: string; fullscreen?: boolean }> = ({ message, fullscreen = false }) => {
  const theme = useTheme();
  const [newMessage, setNewMessage] = useState<string>(message);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    setShowMessage(false);
    setTimeout(() => {
      setNewMessage(message);
      setShowMessage(true);
    }, 1000);
  }, [message]);

  return (
    <Portal show={fullscreen} targetElementById="__next">
      <Root theme={theme} fullscreen={fullscreen} className="hh-test">
        <LogoLoader></LogoLoader>
        <Fade in={showMessage}>
          <Typography className="message" variant="caption">
            {newMessage}
          </Typography>
        </Fade>
      </Root>
    </Portal>
  );
};

export default Loader;
