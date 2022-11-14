import { Button, Collapse, Divider } from "@mui/material";

const RevealNext = ({ children, open, label = "Next", onClick }) => {
  return (
    <Collapse in={open}>
      {children}
      <Divider>
        <Button onClick={onClick}>{label}</Button>
      </Divider>
    </Collapse>
  );
};

export default RevealNext;
