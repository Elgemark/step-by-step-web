import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FC, useState } from "react";
import { useReport } from "../../utils/firebase/api/report";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "./TextField";

const ReportDialogContent: FC<{
  labelButtonSend?: string;
  labelButtonCancel?: string;
  title?: string;
  body?: string;
  onClickCancel: Function;
  onClickSend: Function;
}> = ({
  labelButtonSend = "Send",
  labelButtonCancel = "Cancel",
  title = "Report!",
  body = "Report post?",
  onClickSend,
  onClickCancel,
}) => {
  const [comment, setComment] = useState("");
  const { codes, isLoading } = useReport();

  return (
    <>
      <DialogTitle sx={{ minWidth: "400px" }} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{body}</DialogContentText>
        <List>
          {codes.map((data) => (
            <ListItem disablePadding dense>
              <ListItemButton>
                <ListItemText primary={data.body} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <TextField
          maxLength={10}
          multiline
          fullWidth
          value={comment}
          onChange={(e) => setComment(e.currentTarget.value)}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClickCancel()}>{labelButtonCancel}</Button>
        <Button onClick={() => onClickSend()} autoFocus>
          {labelButtonSend}
        </Button>
      </DialogActions>
    </>
  );
};

export default ReportDialogContent;
