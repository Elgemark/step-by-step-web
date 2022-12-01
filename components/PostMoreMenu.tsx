import * as React from "react";
import { alpha, useTheme } from "@mui/material/styles";
import styled from "styled-components";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import FlagIcon from "@mui/icons-material/Flag";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  open: boolean;
  onClose: Function;
  anchorEl: Element;
  children: React.ReactNode;
}

const StyledMenu = styled(Menu)`
  border-radius: 6;
  margin-top: ${({ theme }) => theme.spacing(1)};
  min-width: 180;
  color: ${({ theme }) => (theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300])};
  .MuiMenu-list {
    padding: "4px 0";
  }
  .MuiSvgIcon-root {
    font-size: 18;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-right: ${({ theme }) => theme.spacing(1.5)};
  }
  .MuiSvgIcon-root:active {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)};
  }
`;

const PostMoreMenu = ({ onEdit, onDelete, onReport }) => {
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
      <StyledMenu
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
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            onReport();
            handleClose();
          }}
          disableRipple
        >
          <FlagIcon />
          Report
        </MenuItem>
      </StyledMenu>
    </>
  );
};

export default PostMoreMenu;
