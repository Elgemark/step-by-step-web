import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import UserAvatar from "../UserAvatar";
import { useUser } from "../../utils/firebase/api";
import { useState, FC } from "react";
import { Button, ButtonGroup, Modal, Stack, useTheme } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import styled from "styled-components";
import ImageIcon from "@mui/icons-material/Image";
import OpenDialog from "../primitives/OpenDialog";
import { useStateObject } from "../../utils/object";
import ImageEditor from "../ImageEditor";
import appSettings from "../../config";
import { uploadImage } from "../../utils/firebase/api/storage";
import { UploadResponse } from "../../utils/firebase/interface";

const Root = styled.div`
  border-radius: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 640px;
  min-height: 320px;
  position: relative;
  background-image: ${({ backgroundImage }) => "url(" + backgroundImage + ")"};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  hr {
    width: 100%;
    margin: ${({ theme }) => theme.spacing(2)};
  }
  .user-avatar {
    margin-top: -54px;
    border: 8px solid ${({ theme }) => (theme.palette.mode === "dark" ? "black" : "white")};
    box-sizing: content-box;
  }
  .user-biography {
    flex-grow: 1;
  }
  .user-wallpaper {
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .button-change-avatar {
    align-self: center;
    margin-top: -2px;
  }
  .button-change-background {
    align-self: flex-end;
  }
`;

const ProfileCardEditable: FC<{
  userId?: string;
  onSave: Function;
  onCancel: Function;
}> = ({ userId, onSave, onCancel, ...props }) => {
  const theme = useTheme();
  const { data: user, update: updateUser, save: saveUser, isCurrentUser, isLoading } = useUser(userId);
  const { object: avatarData, update: updateAvatarObject } = useStateObject({
    url: null,
    file: null,
    cropSettings: { crop: { x: 0, y: 0 }, zoom: 1, aspect: 1 },
  });
  const { object: backgroundData, update: updateBackgroundObject } = useStateObject({
    url: null,
    file: null,
    cropSettings: { crop: { x: 0, y: 0 }, zoom: 1, aspect: appSettings.avatarBackground.aspect },
  });

  const [editImage, setEditImage] = useState<"avatar" | "background" | null>(null);

  const onSaveHandler = async () => {
    const update = { avatar: null, background: null };

    if (avatarData.file) {
      const avatarResp: UploadResponse = await uploadImage(avatarData.file, "1024x1024", "users", userId, "avatar");
      update.avatar = avatarResp.url;
    }
    if (backgroundData.file) {
      const backgroundResp: UploadResponse = await uploadImage(
        backgroundData.file,
        "1024x1024",
        "users",
        userId,
        "background"
      );
      update.background = backgroundResp.url;
    }

    await saveUser(update);
    // onSave();
  };

  console.log("user", user);

  const onCancelHandler = () => {
    onCancel();
  };

  const onChangeAliasHandler = (e) => {
    updateUser("alias", e.target.value);
  };

  const onChangeBiographyHandler = (e) => {
    updateUser("biography", e.target.value);
  };

  const onAvatarSelectHandler = ({ file, url }) => {
    updateAvatarObject({ file, url });
    setEditImage("avatar");
  };

  const onBackgroundSelectHandler = ({ file, url }) => {
    updateBackgroundObject({ file, url });
    setEditImage("background");
  };

  const onCropDoneHandler = ({ blob, url, settings }) => {
    if (editImage === "avatar") {
      updateAvatarObject({ file: blob, url, cropSettings: settings });
    }
    if (editImage === "background") {
      updateBackgroundObject({ file: blob, url, cropSettings: settings });
    }
    setEditImage(null);
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <Root theme={theme} backgroundImage={backgroundData.url} {...props}>
      <Stack spacing={2} width="100%" height="100%" alignItems="center">
        <UserAvatar className="user-avatar" size={72} userId={userId} src={avatarData.url} realtime />
        <OpenDialog className="button-change-avatar" onFileSelected={onAvatarSelectHandler}>
          <Button endIcon={<ImageIcon></ImageIcon>}>avatar</Button>
        </OpenDialog>
        <TextField className="user-alias" fullWidth label="Alias" value={user?.alias} onChange={onChangeAliasHandler} />
        <TextField
          className="user-biography"
          fullWidth
          label="Biography"
          value={user.biography}
          multiline
          inputProps={{ maxLength: 120 }}
          maxRows={3}
          onChange={onChangeBiographyHandler}
        />
        <Typography className="user-biography" variant="body2" color="text.secondary">
          {user.description || ""}
        </Typography>
        <OpenDialog className="button-change-background" onFileSelected={onBackgroundSelectHandler}>
          <Button endIcon={<ImageIcon></ImageIcon>}>background</Button>
        </OpenDialog>
        <ButtonGroup variant="text">
          <Button onClick={onCancelHandler}>Cancel</Button>
          <Button onClick={onSaveHandler}>Save</Button>
        </ButtonGroup>
      </Stack>
      <Modal open={editImage !== null}>
        <ImageEditor
          src={(editImage === "avatar" && avatarData?.url) || (editImage === "background" && backgroundData?.url)}
          onDone={onCropDoneHandler}
          onClose={() => setEditImage(null)}
          settings={
            (editImage === "avatar" && avatarData?.cropSettings) ||
            (editImage === "background" && backgroundData?.cropSettings)
          }
        />
      </Modal>
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
    <Root theme={theme} backgroundImage={user.background} {...props}>
      <Stack spacing={2} width="100%" height="100%" alignItems="center">
        <UserAvatar className="user-avatar" src={user.avatar} size={72} userId={userId} realtime />
        <Typography className="user-alias" variant="h4">
          {user?.alias}
        </Typography>
        <Typography className="user-biography" variant="body2" color="text.secondary">
          {user?.biography || ""}
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
