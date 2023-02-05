import { FC, useState, Fragment, MouseEventHandler } from "react";
import Box from "@mui/material/Box";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import PersonIcon from "@mui/icons-material/Person";
import FeedIcon from "@mui/icons-material/Feed";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

export type Anchor = "top" | "left" | "bottom" | "right";

const SideMenuItem: FC<{ onClick: MouseEventHandler; label: string; icon: ReactJSXElement }> = ({
  onClick,
  label,
  icon,
}) => {
  return (
    <ListItem disablePadding onClick={onClick}>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );
};

const SideMenu: FC<{
  onClose: MouseEventHandler;
  onClickFeed: MouseEventHandler;
  onClickSearch: MouseEventHandler;
  onClickLogin?: MouseEventHandler;
  onClickProfile?: MouseEventHandler;
  onClickBookmarks?: MouseEventHandler;
}> = ({ onClose, onClickFeed, onClickSearch, onClickLogin, onClickProfile, onClickBookmarks }) => {
  return (
    <Box sx={{ width: 200 }} role="presentation" onClick={onClose}>
      <List>
        <SideMenuItem onClick={onClickFeed} label="Feed" icon={<FeedIcon />} />
      </List>
      <Divider />
      {/* ... */}
      <List>
        <SideMenuItem onClick={onClickSearch} label="Search" icon={<SearchIcon />} />
        {onClickLogin && <SideMenuItem onClick={onClickLogin} label="Login" icon={<LoginIcon />} />}
        {onClickProfile && <SideMenuItem onClick={onClickProfile} label="Profile" icon={<PersonIcon />} />}
        {onClickBookmarks && <SideMenuItem onClick={onClickProfile} label="Saved" icon={<BookmarkIcon />} />}
      </List>
      {/* USER */}
      <List>{/* <SideMenuItem onClick={onClickHome} label="Home" icon={<MailIcon />} /> */}</List>
      {/* ADMIN */}
    </Box>
  );
};

export default SideMenu;
