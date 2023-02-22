import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Menu from "./primitives/Menu";
import { FC } from "react";
import CheckboxList from "./primitives/CheckboxList";
import { Divider } from "@mui/material";
import { CollectionItem, CollectionItems, useCollection } from "../utils/firebase/hooks/collections";

const CheckList: FC<{ postId: string; stepId: string; list: CollectionItem }> = ({ postId, stepId, list }) => {
  const { data, updateAndSave } = useCollection(["posts", postId, "lists", list.id, "items"]);
  const checkBoxData = data
    .filter((item) => !item.stepId || item.stepId === stepId)
    .map((item) => ({
      id: item.id,
      label: item.text,
      checked: item.stepId === stepId,
      disabled: item.stepId && item.stepId !== stepId,
    }));

  const onChangeHandler = ({ id: itemId }) => {
    const listItem = data.find((item) => item.id === itemId);
    const checked = listItem.stepId === stepId;
    updateAndSave(itemId, { stepId: checked ? null : stepId });
  };
  return <CheckboxList data={checkBoxData} header={list.title} onChange={onChangeHandler}></CheckboxList>;
};

const StepEditableMoreMenu: FC<{
  postId: string;
  stepId: string;
  onDelete?: Function;
  onAddStep?: Function;
}> = ({ postId, stepId, onDelete, onAddStep }) => {
  const { data: lists } = useCollection(["posts", postId, "lists"]);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkLists = lists.map((list) => {
    return <CheckList postId={postId} stepId={stepId} list={list} />;
  });

  return (
    <>
      <IconButton aria-label="more" onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        dense
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
        {checkLists.length ? <Divider /> : null}
        {checkLists}
      </Menu>
    </>
  );
};

export default StepEditableMoreMenu;
