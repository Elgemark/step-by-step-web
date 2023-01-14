import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FC } from "react";
import { useReport } from "../../utils/firebase/api/report";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

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
  const { codes, isLoading } = useReport();
  console.log("reportData", codes);

  return (
    <>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{body}</DialogContentText>
        <List>
          {codes.map((data) => (
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={data.body} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
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
