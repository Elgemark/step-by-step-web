import { Modal } from "@mui/material";
import styled from "styled-components";
import { FC, useEffect, useRef, useState } from "react";
import * as markerjs2 from "markerjs2";

const StyledModal = styled(Modal)`
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 1024px;
  }
`;

const AnnotationEditor: FC<{
  src: string;
  open: boolean;
  onChange?: (state: markerjs2.MarkerAreaState) => void;
  onClose?: () => void;
  state?: markerjs2.MarkerAreaState;
}> = ({ src, open, onChange, onClose, state }) => {
  //   const [markerArea, setMarkerArea] = useState<markerjs2.MarkerArea>(null);
  const imgRef = useRef<HTMLDivElement>();

  const showPopMarkerArea = () => {
    if (imgRef.current !== null) {
      // create a marker.js MarkerArea
      const _markerArea = new markerjs2.MarkerArea(imgRef.current);
      _markerArea.renderImageType = "image/png";
      _markerArea.renderMarkersOnly = true;
      _markerArea.renderAtNaturalSize = true;
      _markerArea.styles.addRule({ selector: ".__markerjs2_ ", style: "position: fixed !important;" });
      _markerArea.uiStyleSettings.zIndex = "99999";
      //   markerArea.uiStyleSettings.canvasBackgroundColor = "rgba(0,0,0,0)";

      // attach an event handler to assign annotated image back to our image element
      _markerArea.addEventListener("render", (event) => {
        if (imgRef.current) {
          //   imgRef.current.src = event.dataUrl;
          onChange && onChange(event.state);
        }
      });

      _markerArea.addEventListener("close", () => {
        onClose && onClose();
      });

      _markerArea.show();

      //restore
      if (state) {
        _markerArea.restoreState(state);
      }
    }
  };

  return (
    <StyledModal
      open={open}
      onClose={() => {
        onClose && onClose();
      }}
    >
      <div ref={imgRef} style={{ position: "relative" }}>
        <img src={src} width="100%" onLoad={() => showPopMarkerArea()}></img>
      </div>
    </StyledModal>
  );
};

export default AnnotationEditor;
