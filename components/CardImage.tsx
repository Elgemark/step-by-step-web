import { CardMedia } from "@mui/material";
import { Modal } from "@mui/material";
import styled from "styled-components";
import { FC, useState } from "react";
import { useAnnotateLive } from "../hooks/annotate";
import Annotation from "./primitives/Annotation";

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

const CardImage: FC<{ height?: any; src?: string; enableFullscreen?: boolean; annotation?: string; alt: string }> = ({
  height,
  src,
  enableFullscreen = false,
  annotation,
  alt,
  ...rest
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  // const { ref } = useAnnotateLive(annotation && JSON.parse(annotation));

  if (!src) {
    return null;
  }

  return (
    <>
      <div style={{ position: "relative" }}>
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
        {annotation ? <Annotation state={JSON.parse(annotation)} /> : null}
      </div>

      {enableFullscreen ? (
        <StyledModal open={fullscreen} onClose={() => setFullscreen(false)}>
          <div style={{ position: "relative" }}>
            <img
              onClick={() => {
                if (fullscreen) {
                  setFullscreen(false);
                }
              }}
              src={src}
              width="100%"
            ></img>
            {annotation ? <Annotation state={JSON.parse(annotation)} delay={500} /> : null}
          </div>
        </StyledModal>
      ) : null}
    </>
  );
};

export default CardImage;
