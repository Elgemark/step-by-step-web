import { FC, MouseEventHandler } from "react";
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
import InfoIcon from "@mui/icons-material/Info";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

export type Anchor = "top" | "left" | "bottom" | "right";

const SideMenuItem: FC<{ onClick: MouseEventHandler; label: string; icon: ReactJSXElement; dense?: boolean }> = ({
  onClick,
  label,
  icon,
  dense,
}) => {
  return (
    <ListItem disablePadding onClick={onClick} dense={dense}>
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
  onClickReview?: MouseEventHandler;
  onClickAbout?: MouseEventHandler;
}> = ({
  onClose,
  onClickFeed,
  onClickSearch,
  onClickLogin,
  onClickProfile,
  onClickBookmarks,
  onClickReview,
  onClickAbout,
}) => {
  return (
    <Box sx={{ width: 200 }} role="presentation" onClick={onClose} component="nav">
      <List>
        <SideMenuItem onClick={onClickFeed} label="Feed" icon={<FeedIcon />} dense />
      </List>
      <Divider />
      {/* ... */}
      <List>
        <SideMenuItem onClick={onClickSearch} label="Discover" icon={<SearchIcon />} dense />
      </List>
      <Divider />
      <List>
        {onClickLogin && <SideMenuItem onClick={onClickLogin} label="Login" icon={<LoginIcon />} dense />}
        {onClickProfile && <SideMenuItem onClick={onClickProfile} label="Profile" icon={<PersonIcon />} dense />}
        {onClickBookmarks && <SideMenuItem onClick={onClickProfile} label="Saved" icon={<BookmarkIcon />} dense />}
      </List>
      {/* USER */}
      <List>{/* <SideMenuItem onClick={onClickHome} label="Home" icon={<MailIcon />} /> */}</List>
      <Divider />
      {onClickBookmarks && <SideMenuItem onClick={onClickAbout} label="About" icon={<InfoIcon />} dense />}
      {/* ADMIN */}
      {onClickReview && <SideMenuItem onClick={onClickReview} label="Review" icon={<TroubleshootIcon />} dense />}
    </Box>
  );
};

export default SideMenu;
