import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import UserAvatar from "../UserAvatar";
import { useUser } from "../../utils/firebase/api";
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

const ProfileCardEditable: FC<{
  userId?: string;
  onSave: Function;
  onCancel: Function;
}> = ({ userId, onSave, onCancel, ...props }) => {
  const theme = useTheme();
  const { data: user, update, save: saveUser, isCurrentUser, isLoading } = useUser(userId);

  const onSaveHandler = () => {
    saveUser();
    onSave();
  };

  const onCancelHandler = () => {
    onCancel();
  };

  const onChangeAliasHandler = (e) => {
    update("alias", e.target.value);
  };

  return (
    <Root theme={theme} {...props}>
      <Stack spacing={2} width="100%" alignItems="center">
        <UserAvatar size={72} userId={userId} realtime />
        <TextField className="user-alias" fullWidth label="Alias" value={user?.alias} onChange={onChangeAliasHandler} />
        <Typography className="user-description" variant="body2" color="text.secondary">
          {user?.description || ""}
        </Typography>
        <ButtonGroup variant="text">
          <Button onClick={onCancelHandler}>Cancel</Button>
          <Button onClick={onSaveHandler}>Save</Button>
        </ButtonGroup>
      </Stack>
    </Root>
  );
};

const ProfileCardDefault: FC<{
  userId?: string;
  onEdit: any;
  onSignOut: any;
}> = ({ userId, onEdit, ...props }) => {
  const theme = useTheme();
  const [signOut] = useSignOut(getAuth());
  const { data: user } = useUser(userId);

  const onSignOutHandler = () => {
    signOut();
  };

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
        <ButtonGroup variant="text">
          <Button onClick={onEdit}>Edit</Button>
          <Button onClick={onSignOutHandler}>Log Out</Button>
        </ButtonGroup>
      </Stack>
    </Root>
  );
};

const ProfileCard = (props) => {
  const [edit, setEdit] = useState(false);

  const onEditHandler = () => {
    setEdit(true);
  };

  const onSaveHandler = () => {
    setEdit(false);
  };

  const onCancelHandler = () => {
    setEdit(false);
  };

  if (edit) {
    return <ProfileCardEditable onSave={onSaveHandler} onCancel={onCancelHandler} {...props} />;
  } else {
    return <ProfileCardDefault onEdit={onEditHandler} {...props} />;
  }
};

export default ProfileCard;
