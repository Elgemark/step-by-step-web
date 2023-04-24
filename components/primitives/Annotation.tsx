import { useEffect, FC } from "react";
import * as mjslive from "markerjs-live";
import styled from "styled-components";
import { useAnnotateLive } from "../../hooks/annotate";

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
  .__markerjslive_ {
    z-index: unset !important;
  }
  svg {
    pointer-events: none !important;
  }
`;

const Annotation: FC<{ state: mjslive.MarkerAreaState }> = ({ state }) => {
  const { ref: imgOverlayRef, update: updateAnnotateLive } = useAnnotateLive();

  useEffect(() => {
    updateAnnotateLive();
    setTimeout(() => {
      updateAnnotateLive(state);
    }, 100);
  }, [state]);

  return <Root ref={imgOverlayRef} className="annotate-overlay" />;
};

export default Annotation;
