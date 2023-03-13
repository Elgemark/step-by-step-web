import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { FC, useRef, useState } from "react";
import { ClickAwayListener, Divider, Grow, MenuList, Paper } from "@mui/material";
import { CollectionItem, useCollection } from "../utils/firebase/hooks/collections";
import ListTableItem from "./primitives/ListTableItem";
import styled from "styled-components";
import Popper from "@mui/material/Popper";

const StyledMenu = styled(Paper)`
  padding: 12px;
`;

const List: FC<{ postId: string; stepId: string; list: CollectionItem }> = ({ postId, stepId, list }) => {
  const { data } = useCollection(["posts", postId, "lists", list.id, "items"]);
  const listData = data
    .filter((item) => !item.stepId || item.stepId === stepId)
    .map((item) => ({
      text: item.text,
      value: item.value,
    }));

  return (
    <div style={{ width: "100%" }}>
      {listData.map((data) => (
        <ListTableItem {...data} className="list-table-item"></ListTableItem>
      ))}
    </div>
  );
};

const StepMoreMenu: FC<{
  postId: string;
  stepId: string;
  onRollBack?: Function;
}> = ({ postId, stepId, onRollBack }) => {
  const { data: lists } = useCollection(["posts", postId, "lists"]);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const listItems = lists.map((list) => {
    return <List postId={postId} stepId={stepId} list={list} />;
  });

  return (
    <>
      <IconButton ref={anchorRef} aria-label="more" onClick={handleToggle}>
        <MoreVertIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <StyledMenu elevation={3}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {/* ROLL BACK */}
                  {onRollBack && (
                    <MenuItem
                      onClick={() => {
                        onRollBack({ stepId });
                        setOpen(false);
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
                </MenuList>
              </ClickAwayListener>
            </StyledMenu>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default StepMoreMenu;
