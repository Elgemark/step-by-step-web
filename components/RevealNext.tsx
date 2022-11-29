import { Button, Collapse, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { ReactNode, useRef } from "react";
import { FC } from "react";

const RevealNext: FC<{
  open: boolean;
  onClick: Function;
  showButton?: boolean;
  showDone?: boolean;
  children?: ReactNode;
  label: string;
  scrollIntoViewTimeout?: number;
}> = ({ children, open, showButton = true, showDone = false, label, onClick, scrollIntoViewTimeout = 500 }) => {
  const ref = useRef<HTMLInputElement>(null);

  const onEndHandler = () => {
    setTimeout(() => {
      ref.current.scrollIntoView({
        behavior: "smooth",
      });
    }, scrollIntoViewTimeout);
  };
  return (
    <Collapse ref={ref} in={open} addEndListener={onEndHandler}>
      {children}
      {/* NEXT */}
      <Collapse in={showButton}>
        <Divider>
          <Button onClick={() => onClick()}>{label}</Button>
        </Divider>
      </Collapse>
      {/* DONE */}
      <Collapse in={showDone}>
        <Divider>
          <CheckCircleIcon fontSize="large" />
        </Divider>
      </Collapse>
    </Collapse>
  );
};

export default RevealNext;
