import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { FC, useState } from "react";
import { Report, ReportCode, useReport } from "../../utils/firebase/api/report";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import TextField from "./TextField";
import styled from "styled-components";
import { useTheme } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import _ from "lodash";

const Root = styled.div`
  .text-input {
    margin-top: ${({ theme }) => theme.spacing(2)};
  }
  ul {
    margin-top: ${({ theme }) => theme.spacing(2)};
  }
`;

const report: Report = { code: null, body: null, comment: null };

const ReportDialogContent: FC<{
  labelButtonSend?: string;
  labelButtonCancel?: string;
  title?: string;
  body?: string;
  onClickCancel: Function;
  onClickSend: (data: Report) => void;
}> = ({
  labelButtonSend = "Send",
  labelButtonCancel = "Cancel",
  title = "Report!",
  body = "Why are you reporting this post?",
  onClickSend,
  onClickCancel,
}) => {
  const theme = useTheme();
  const { codes, isLoading } = useReport();
  const [selected, setSelected] = useState();

  const updateReport = (path, value) => {
    _.set(report, path, value);
  };

  return (
    <Root theme={theme}>
      <DialogTitle sx={{ minWidth: "400px" }} id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{body}</DialogContentText>
        <List>
          {codes.map((data) => (
            <ListItem disablePadding dense>
              <ListItemButton
                selected={selected === data.code}
                onClick={() => {
                  setSelected(data.code);
                  updateReport("body", data.body);
                  updateReport("code", data.code);
                }}
              >
                <ListItemText primary={data.body} />
                {selected === data.code && (
                  <ListItemIcon>
                    <CheckIcon />
                  </ListItemIcon>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <TextField
          className="text-input"
          label="Additional info"
          maxLength={140}
          multiline
          fullWidth
          onChange={(e) => updateReport("comment", e.currentTarget.value)}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClickCancel()}>{labelButtonCancel}</Button>
        <Button onClick={() => onClickSend(report)} autoFocus>
          {labelButtonSend}
        </Button>
      </DialogActions>
    </Root>
  );
};

export default ReportDialogContent;
