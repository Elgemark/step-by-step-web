import { useEffect, FC } from "react";
import * as mjslive from "markerjs-live";
import styled from "styled-components";
import { useAnnotateLive } from "../../hooks/annotate";

const Root = styled.div`
  position: absolute;
  top: 0;
  left: 0;
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

const Annotation: FC<{ state: mjslive.MarkerAreaState; delay?: number }> = ({ state, delay = 200 }) => {
  const { ref: imgOverlayRef, update: updateAnnotateLive } = useAnnotateLive();

  useEffect(() => {
    updateAnnotateLive();
    // Sometimes the annotaion is not showing up until retriggering by delay
    setTimeout(() => {
      updateAnnotateLive(state);
    }, delay);
  }, [state]);

  return <Root ref={imgOverlayRef} className="annotate-overlay" />;
};

export default Annotation;
