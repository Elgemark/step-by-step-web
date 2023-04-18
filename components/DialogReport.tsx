import { Dialog } from "@mui/material";
import { FC } from "react";
import { useMessages } from "./Messages";
import { setReport } from "../utils/firebase/api/report";
import ReportDialogContent from "./primitives/ReportDialogContent";

export type ReportData = {
  postId: string;
  userId: string;
};

const DialogReport: FC<{
  open: ReportData;
  onClose: (report) => void;
}> = ({ open, onClose }) => {
  const { addMessage } = useMessages();

  const reportHandler = (report) => {
    setReport(open.postId, open.userId, report)
      .then((e) => {
        if (!e.error) {
          addMessage({ id: "alert", message: "Report sent successfully!" });
        } else {
          addMessage({ id: "alert", message: "An error occured. Please try againg!" });
        }
      })
      .catch((e) => {
        addMessage({ id: "alert", message: "An error occured. Please try againg!" });
      });
  };

  return (
    <Dialog open={Boolean(open)} onClose={onClose}>
      <ReportDialogContent
        onClickCancel={onClose}
        onClickSend={(report) => {
          reportHandler(report);
          onClose(report);
        }}
      />
    </Dialog>
  );
};

export default DialogReport;
