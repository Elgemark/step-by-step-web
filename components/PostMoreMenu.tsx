import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import FlagIcon from "@mui/icons-material/Flag";
import DeleteIcon from "@mui/icons-material/Delete";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import Menu from "./primitives/Menu";
import { FC } from "react";

const PostMoreMenu: FC<{
  onEdit?: Function;
  onDelete?: Function;
  onStartOver?: Function;
  onReport?: Function;
  onReview?: Function;
}> = ({ onEdit, onDelete, onStartOver, onReport, onReview }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton aria-label="more" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        theme={theme}
      >
        {/* EDIT */}
        {onEdit && (
          <MenuItem
            onClick={() => {
              onEdit();
              handleClose();
            }}
            disableRipple
          >
            <EditIcon />
            Edit
          </MenuItem>
        )}
        {/* DELETE */}
        {onDelete && (
          <MenuItem
            onClick={() => {
              onDelete();
              handleClose();
            }}
            disableRipple
          >
            <DeleteIcon />
            Delete
          </MenuItem>
        )}
        {/* STRART OVER */}
        {onStartOver && (
          <MenuItem
            onClick={() => {
              onStartOver();
              handleClose();
            }}
            disableRipple
          >
            <RestartAltIcon />
            Start Over
          </MenuItem>
        )}
        {/* DIVIDER */}
        {onReport || onReview ? <Divider sx={{ my: 0.5 }} /> : null}
        {/* REPORT */}
        {onReport && (
          <MenuItem
            onClick={
              onReport &&
              (() => {
                onReport();
                handleClose();
              })
            }
            disableRipple
          >
            <FlagIcon />
            Report
          </MenuItem>
        )}
        {/* Review */}
        {onReview && (
          <MenuItem
            onClick={
              onReport &&
              (() => {
                onReview();
                handleClose();
              })
            }
            disableRipple
          >
            <TroubleshootIcon />
            Review
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default PostMoreMenu;
