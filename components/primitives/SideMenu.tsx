import { FC, MouseEventHandler } from "react";
import Box from "@mui/material/Box";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
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
import styled from "styled-components";
import Link from "next/link";

export type Anchor = "top" | "left" | "bottom" | "right";

const StyledLink = styled(Link)`
  all: unset;
`;

const SideMenuItem: FC<{
  label: string;
  icon: ReactJSXElement;
  dense?: boolean;
  href: string;
}> = ({ label, icon, href }) => {
  if (!href) {
    return null;
  }

  return (
    <StyledLink href={href} title={label}>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </StyledLink>
  );
};

const SideMenu: FC<{
  hrefFeed?: string;
  hrefDiscover?: string;
  hrefLogin?: string;
  hrefProfile?: string;
  hrefBookmarks?: string;
  hrefAbout?: string;
  hrefReview?: string;
  onClose: MouseEventHandler;
}> = ({ hrefFeed, hrefDiscover, hrefLogin, hrefProfile, hrefBookmarks, hrefAbout, hrefReview, onClose }) => {
  return (
    <Box sx={{ width: 200 }} role="presentation" onClick={onClose} component="nav">
      <List>
        <SideMenuItem label="Feed" href={hrefFeed} icon={<FeedIcon />} dense />
      </List>
      <Divider />
      {/* ... */}
      <List>
        <SideMenuItem href={hrefDiscover} label="Discover" icon={<SearchIcon />} dense />
      </List>
      <Divider />
      <List>
        <SideMenuItem href={hrefLogin} label="Login" icon={<LoginIcon />} dense />
        <SideMenuItem href={hrefProfile} label="Profile" icon={<PersonIcon />} dense />
        <SideMenuItem href={hrefBookmarks} label="Saved" icon={<BookmarkIcon />} dense />
      </List>
      <Divider />
      <SideMenuItem href={hrefAbout} label="About" icon={<InfoIcon />} dense />
      {/* ADMIN */}
      <SideMenuItem href={hrefReview} label="Review" icon={<TroubleshootIcon />} dense />
    </Box>
  );
};

export default SideMenu;
