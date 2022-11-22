import { Button, Collapse, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const RevealNext = ({ children, open, showButton = true, showDone = false, label = "Next", onClick }) => {
  return (
    <Collapse in={open}>
      {children}
      {/* NEXT */}
      <Collapse in={showButton}>
        <Divider>
          <Button onClick={onClick}>{label}</Button>
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
