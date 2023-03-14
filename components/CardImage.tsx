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
  object-fit: contain;
  cursor: ${({ enableFullscreen }) => (enableFullscreen ? "zoom-in" : "auto")};
`;

const CardImage: FC<{ height?: any; src?: string; enableFullscreen?: boolean }> = ({
  height,
  src,
  enableFullscreen = false,
}) => {
  const [fullscreen, setFullscreen] = useState(false);

  if (!src) {
    return null;
  }

  return (
    <>
      <StyledCardMedia
        component="img"
        height={height}
        image={src}
        onClick={() => enableFullscreen && setFullscreen(true)}
        enableFullscreen={enableFullscreen}
      />
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
    </>
  );
};

export default CardImage;
