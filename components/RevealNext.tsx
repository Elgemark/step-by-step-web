import { Collapse, Divider } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { ReactNode, useRef } from "react";
import { FC } from "react";

const RevealNext: FC<{
  open: boolean;
  onClick: Function;
  showButton?: boolean;
  isLoading?: boolean;
  children?: ReactNode;
  label: string;
  scrollIntoViewTimeout?: number;
}> = ({ children, open, showButton = true, isLoading = false, label, onClick, scrollIntoViewTimeout = 500 }) => {
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
          <LoadingButton loading={isLoading} onClick={() => onClick()}>
            {label}
          </LoadingButton>
        </Divider>
      </Collapse>
    </Collapse>
  );
};

export default RevealNext;
