import { Button, Collapse, Divider } from "@mui/material";

const RevealNext = ({ children, open, onClickNext }) => {
  return (
    <Collapse in={open}>
      {children}
      <Divider>
        <Button onClick={onClickNext}>NEXT</Button>
      </Divider>
    </Collapse>
  );
};
