import { CircularProgress, Fade, Slide, Typography, useTheme } from "@mui/material";
import { FC, useEffect, useState } from "react";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .message {
    margin-top: ${({ theme }) => theme.spacing(3)};
  }
`;

const Loader: FC<{ message?: string }> = ({ message }) => {
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
    <Root theme={theme}>
      <CircularProgress></CircularProgress>
      <Fade in={showMessage}>
        <Typography className="message" variant="caption">
          {newMessage}
        </Typography>
      </Fade>
    </Root>
  );
};

export default Loader;
