import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Menu from "./primitives/Menu";
import { FC } from "react";
import { Divider } from "@mui/material";
import { CollectionItem, useCollection } from "../utils/firebase/hooks/collections";
import ListTable from "./primitives/ListTable";
import ListTableItem from "./primitives/ListTableItem";

const List: FC<{ postId: string; stepId: string; list: CollectionItem }> = ({ postId, stepId, list }) => {
  const { data } = useCollection(["posts", postId, "lists", list.id, "items"]);
  const listData = data
    .filter((item) => !item.stepId || item.stepId === stepId)
    .map((item) => ({
      text: item.text,
      value: item.value,
    }));

  return (
    <ListTable>
      {listData.map((data) => (
        <ListTableItem {...data}></ListTableItem>
      ))}
    </ListTable>
  );
};

const StepMoreMenu: FC<{
  postId: string;
  stepId: string;
  onRollBack?: Function;
}> = ({ postId, stepId, onRollBack }) => {
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

  const listItems = lists.map((list) => {
    return <List postId={postId} stepId={stepId} list={list} />;
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
        {/* ROLL BACK */}
        {onRollBack && (
          <MenuItem
            onClick={() => {
              onRollBack({ stepId });
              handleClose();
            }}
            disableRipple
          >
            <RestartAltIcon />
            Roll Back
          </MenuItem>
        )}

        {/* LISTS */}
        {listItems.length ? <Divider /> : null}
        {listItems}
      </Menu>
    </>
  );
};

export default StepMoreMenu;
