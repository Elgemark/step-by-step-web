import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Menu from "./primitives/Menu";
import { FC } from "react";
import { Lists } from "../utils/firebase/type";
import CheckboxList from "./primitives/CheckboxList";
import { Divider } from "@mui/material";

const StepMoreMenu: FC<{ index: number; onDelete?: Function; onAddStep?: Function; lists?: Lists }> = ({
  index,
  onDelete,
  onAddStep,
  lists = [],
}) => {
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
        {/* ADD STEP */}
        {onAddStep && (
          <MenuItem
            onClick={() => {
              onAddStep();
              handleClose();
            }}
            disableRipple
          >
            <AddIcon />
            Step
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
        {/* LISTS */}
        <Divider />
        <CheckboxList></CheckboxList>
      </Menu>
    </>
  );
};

export default StepMoreMenu;
