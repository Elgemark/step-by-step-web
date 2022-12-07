import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import UserAvatar from "./UserAvatar";
import { useUser } from "../utils/firebase/api";
import { useState, FC } from "react";
import { Button, ButtonGroup, Paper, Stack, useTheme } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { SyntheticEvent } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
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

const ProfileCard: FC<{
  onTabChange: (event: SyntheticEvent<Element, Event>, value: any) => void;
  tabValue: string;
}> = (tabValue, onTabChange, ...props) => {
  const theme = useTheme();
  const [signOut, signOutLoading, signOutError] = useSignOut(getAuth());
  const [edit, setEdit] = useState(false);
  const { data: user, update, save: saveUser, isLoading } = useUser();

  const onEditHandler = () => {
    setEdit(true);
  };

  const onSignOutHandler = () => {
    signOut();
  };

  const onSaveHandler = () => {
    setEdit(false);
    saveUser();
  };

  const onCancelHandler = () => {
    setEdit(false);
  };

  const onChangeAliasHandler = (e) => {
    update("alias", e.target.value);
  };

  return (
    <Root theme={theme} {...props}>
      <Stack spacing={2} width="100%" alignItems="center">
        <UserAvatar size={72} realtime />
        {edit ? (
          <TextField
            className="user-alias"
            fullWidth
            label="Alias"
            value={user?.alias}
            onChange={onChangeAliasHandler}
          />
        ) : (
          <Typography className="user-alias" variant="h4">
            {user?.alias}
          </Typography>
        )}
        <Typography className="user-description" variant="body2" color="text.secondary">
          {user?.description || ""}
        </Typography>
        <ButtonGroup variant="text">
          {edit ? (
            <>
              <Button onClick={onCancelHandler}>Cancel</Button>
              <Button onClick={onSaveHandler}>Save</Button>
            </>
          ) : (
            <>
              <Button onClick={onEditHandler}>Edit</Button>
              <Button onClick={onSignOutHandler}>Log Out</Button>
            </>
          )}
        </ButtonGroup>
      </Stack>
      <Divider />
      <Tabs value={tabValue} onChange={onTabChange} aria-label="basic tabs example">
        <Tab label="Saved" icon={<BookmarkIcon />} {...tabProps(0)} value="saved" />
        <Tab label="Created" icon={<CreateIcon />} {...tabProps(1)} value="created" />
        <Tab label="Completed" icon={<CheckCircleIcon />} {...tabProps(2)} value="completed" />
        <Tab label="Incompleted" icon={<UnpublishedIcon />} {...tabProps(3)} value="incompleted" />
      </Tabs>
    </Root>
  );
};

export default ProfileCard;
