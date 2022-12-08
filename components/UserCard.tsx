import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import UserAvatar from "./UserAvatar";
import { useUser } from "../utils/firebase/api";
import { FC } from "react";
import { Stack, useTheme } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { SyntheticEvent } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styled from "styled-components";

const Root = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  align-items: center;
  hr {
    width: 100%;
    margin: ${({ theme }) => theme.spacing(2)};
  }
`;

const tabProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const UserCard: FC<{
  onTabChange: (event: SyntheticEvent<Element, Event>, value: any) => void;
  tabValue: string;
  userId?: string;
}> = ({ tabValue, onTabChange, userId, ...props }) => {
  const theme = useTheme();
  const { data: user, update, isLoading } = useUser(userId);

  return (
    <Root theme={theme} {...props}>
      <Stack spacing={2} width="100%" alignItems="center">
        <UserAvatar size={72} userId={userId} realtime />
        <Typography className="user-alias" variant="h4">
          {user?.alias}
        </Typography>
        <Typography className="user-description" variant="body2" color="text.secondary">
          {user?.description || ""}
        </Typography>
      </Stack>
      <Divider />
      <Tabs value={tabValue} onChange={onTabChange} aria-label="post tabs">
        <Tab label="Created" icon={<CreateIcon />} {...tabProps(1)} value="created" />
        <Tab label="Saved" icon={<BookmarkIcon />} {...tabProps(0)} value="saved" />
        <Tab label="Follows" icon={<CheckCircleIcon />} {...tabProps(2)} value="follows" />
      </Tabs>
    </Root>
  );
};

export default UserCard;
