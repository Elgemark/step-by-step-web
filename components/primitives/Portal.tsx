import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const Portal: FC<{ children: ReactJSXElement; show: boolean; target?: Element; targetElementById?: string }> = ({
  children,
  targetElementById,
  show,
  target,
}) => {
  const [_target, _setTarget] = useState(target);

  useEffect(() => {
    if (targetElementById) {
      _setTarget(document.getElementById(targetElementById));
    }
  }, [targetElementById]);

  if (show && _target) {
    return <>{createPortal(children, _target)}</>;
  } else {
    return children;
  }
};

export default Portal;
