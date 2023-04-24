import { useEffect, useRef, FC } from "react";
import * as mjslive from "markerjs-live";
import styled from "styled-components";

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
  let markerView: mjslive.MarkerView;
  const imgOverlayRef = useRef<HTMLElement>(null);

  useEffect(() => {
    showMarkerAreaLive(state);
  }, [state]);

  const showMarkerAreaLive = (state?: mjslive.MarkerAreaState) => {
    if (imgOverlayRef.current !== null) {
      // create a marker.js MarkerArea
      if (!markerView) {
        markerView = new mjslive.MarkerView(imgOverlayRef.current);
        markerView.targetRoot = imgOverlayRef.current;
      }

      if (state) {
        markerView.show(state);
      } else {
        markerView.close();
      }
    }
  };

  return <Root ref={imgOverlayRef} className="annotate-overlay" />;
};

export default Annotation;
