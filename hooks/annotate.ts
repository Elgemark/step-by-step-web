import { useEffect, useRef, useState } from "react";
import * as mjslive from "markerjs-live";

export const useAnnotateLive = (annotation?: mjslive.MarkerAreaState) => {
  const [markerView, setMarkerView] = useState<mjslive.MarkerView>(null);
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<mjslive.MarkerAreaState>(annotation);

  useEffect(() => {
    if (markerView) {
      updateMarkerAreaLive(markerView, state);
    }
  }, [state, markerView]);

  useEffect(() => {
    if (ref.current && !markerView) {
      const _markerView = new mjslive.MarkerView(ref.current);
      _markerView.targetRoot = ref.current;
      setMarkerView(_markerView);
    }
  }, [ref.current]);

  const updateMarkerAreaLive = (_markerView: mjslive.MarkerView, newState?: mjslive.MarkerAreaState) => {
    if (_markerView) {
      if (newState) {
        console.log("updateMarkerAreaLive", newState);
        _markerView.show(newState);
      } else {
        _markerView.close();
      }
    }
    setState(newState);
  };

  return {
    ref,
    update: (state?: mjslive.MarkerAreaState) => setState(state),
    state,
  };
};
