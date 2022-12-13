import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import UserAvatar from "./UserAvatar";
import { useUser } from "../utils/firebase/api";
import { useState, FC } from "react";
import { Button, ButtonGroup, Stack, useTheme } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
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

const ProfileCard: FC<{
  userId?: string;
}> = ({ userId, ...props }) => {
  const theme = useTheme();
  const [signOut, signOutLoading, signOutError] = useSignOut(getAuth());
  const [edit, setEdit] = useState(false);
  const { data: user, update, save: saveUser, isCurrentUser, isLoading } = useUser(userId);

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
        <UserAvatar size={72} userId={userId} realtime />
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
    </Root>
  );
};

export default ProfileCard;
