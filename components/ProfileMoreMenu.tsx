import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import Menu from "./primitives/Menu";
import { FC } from "react";

const ProfileMoreMenu: FC<{ onEdit: Function; onSignOut: Function }> = ({ onEdit, onSignOut, ...props }) => {
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
      <IconButton aria-label="more" onClick={handleClick} {...props}>
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
        {/* SIGN OUT */}
        <MenuItem
          onClick={() => {
            onSignOut();
            handleClose();
          }}
          disableRipple
        >
          <LogoutIcon />
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMoreMenu;
