import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Menu from "./primitives/Menu";
import { FC } from "react";
import CheckboxList, { ListItemData } from "./primitives/CheckboxList";
import { Divider } from "@mui/material";
import { CollectionItem, CollectionItems, useCollection } from "../utils/firebase/hooks/collections";

const CheckList: FC<{ postId: string; list: CollectionItem; onChange?: (id) => void }> = ({
  postId,
  list,
  onChange,
}) => {
  const { data } = useCollection(["posts", postId, "lists", list.id, "items"]);
  const checkBoxData = data.map((item) => ({ id: item.id, label: item.text, checked: false }));
  return <CheckboxList data={checkBoxData} header={list.title} onChange={onChange}></CheckboxList>;
};

const StepMoreMenu: FC<{
  postId: string;
  index: number;
  onDelete?: Function;
  onAddStep?: Function;
  lists?: CollectionItems;
  onListChange?: (id) => void;
}> = ({ postId, index, onDelete, onAddStep, lists = [], onListChange }) => {
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
    return <CheckList postId={postId} list={list} onChange={onListChange} />;
  });

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
        {checkLists.length ? <Divider /> : null}
        {checkLists}
      </Menu>
    </>
  );
};

export default StepMoreMenu;
