import { CardMedia } from "@mui/material";
import { Modal } from "@mui/material";
import styled from "styled-components";
import { FC, useState } from "react";

const StyledModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: zoom-out;
  img {
    max-width: 1024px;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  cursor: ${({ enableFullscreen }) => (enableFullscreen ? "zoom-in" : "auto")};
`;

const CardImage: FC<{ height?: any; src?: string; enableFullscreen?: boolean; alt: string }> = ({
  height,
  src,
  enableFullscreen = false,
  alt,
  ...rest
}) => {
  const [fullscreen, setFullscreen] = useState(false);

  if (!src) {
    return null;
  }

  return (
    <>
      <StyledCardMedia
        component="img"
        width="100%"
        height="auto"
        image={src}
        onClick={() => enableFullscreen && setFullscreen(true)}
        enableFullscreen={enableFullscreen}
        alt={alt}
        {...rest}
      />
      {enableFullscreen ? (
        <StyledModal open={fullscreen} onClose={() => setFullscreen(false)}>
          <img
            onClick={() => {
              if (fullscreen) {
                setFullscreen(false);
              }
            }}
            src={src}
            width="100%"
          ></img>
        </StyledModal>
      ) : null}
    </>
  );
};

export default CardImage;
