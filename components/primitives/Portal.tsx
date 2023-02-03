import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { FC } from "react";
import { createPortal } from "react-dom";

const Portal: FC<{ children: ReactJSXElement; show: boolean; target: Element | DocumentFragment }> = ({
  children,
  show,
  target,
}) => {
  if (show) {
    return <>{createPortal(children, target)}</>;
  } else {
    return children;
  }
};

export default Portal;
