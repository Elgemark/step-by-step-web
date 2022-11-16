import { Button, Collapse, Divider } from "@mui/material";

const RevealNext = ({ children, open, showButton = true, label = "Next", onClick }) => {
  return (
    <Collapse in={open}>
      {children}
      <Collapse in={showButton}>
        <Divider>
          <Button onClick={onClick}>{label}</Button>
        </Divider>
      </Collapse>
    </Collapse>
  );
};

export default RevealNext;
