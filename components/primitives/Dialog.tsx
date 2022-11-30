import Button from "@mui/material/Button";
import MUIDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FC } from "react";

const Dialogen: FC<{
  open?: boolean;
  title?: string;
  content: string;
  labelButtonOk?: string;
  labelButtonCancel?: string;
  onClose: Function;
  onClickOk: Function;
  onClickCancel: Function;
}> = ({
  open = false,
  title = "",
  content = "",
  labelButtonOk = "Ok",
  labelButtonCancel = "Cancel",
  onClose,
  onClickOk,
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
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClickCancel()}>{labelButtonCancel}</Button>
          <Button onClick={() => onClickOk()} autoFocus>
            {labelButtonOk}
          </Button>
        </DialogActions>
      </MUIDialog>
    </>
  );
};

export default Dialogen;
