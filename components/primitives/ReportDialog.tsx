import Button from "@mui/material/Button";
import MUIDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FC } from "react";

const ReportDialog: FC<{
  open?: any;
  labelButtonSend?: string;
  labelButtonCancel?: string;
  onClose: (value: string) => void;
  onClickCancel: Function;
  onClickSend: Function;
}> = ({
  open = false,
  labelButtonSend = "Send",
  labelButtonCancel = "Cancel",
  onClose,
  onClickSend,
  onClickCancel,
}) => {
  return (
    <>
      <MUIDialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Report"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{"Report!"}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClickCancel()}>{labelButtonCancel}</Button>
          <Button onClick={() => onClickSend()} autoFocus>
            {labelButtonSend}
          </Button>
        </DialogActions>
      </MUIDialog>
    </>
  );
};

export default ReportDialog;
