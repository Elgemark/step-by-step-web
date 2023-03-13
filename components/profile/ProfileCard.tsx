import { useUser } from "../../utils/firebase/api";
import { useState, FC } from "react";
import { Button, ButtonGroup, CircularProgress, Modal } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useStateObject } from "../../utils/object";
import ImageEditor from "../ImageEditor";
import appSettings from "../../config";
import { uploadImage } from "../../utils/firebase/api/storage";
import { UploadResponse } from "../../utils/firebase/interface";
import UserCard, { UserCardBigEditable } from "../primitives/UserCard";
import { useCategories } from "../../utils/firebase/api/categories";
import _ from "lodash";
import { useRouter } from "next/router";

const ProfileCardEditable: FC<{
  userId?: string;
  onSave: Function;
  onCancel: Function;
}> = ({ userId, onSave, onCancel }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { data: user, update: updateUser, save: saveUser, isLoading } = useUser(userId);
  const { categories } = useCategories();

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
    setIsSaving(true);
    const update = _.pick(user, ["biography", "alias", "interests"]);
    // Avatar...
    if (avatarData.file) {
      const avatarResp: UploadResponse = await uploadImage(avatarData.file, "1024x1024", ["users", userId], "avatar");
      update.avatar = avatarResp.url;
    }
    // Background...
    if (backgroundData.file) {
      const backgroundResp: UploadResponse = await uploadImage(
        backgroundData.file,
        "1024x1024",
        ["users", userId],
        "background"
      );
      update.background = backgroundResp.url;
    }

    const resp = await saveUser(update);
    console.log("resp", { resp, update });
    setIsSaving(false);
    onSave();
  };

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

  const onInterestSelectHandler = ({ category }) => {
    const newUserInterests = user.interests ? [...user.interests] : [];
    if (newUserInterests.includes(category)) {
      _.pull(newUserInterests, category);
    } else {
      newUserInterests.push(category);
    }
    // Max 3!
    if (newUserInterests.length <= 3) {
      updateUser("interests", newUserInterests);
    }
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
    <>
      <UserCardBigEditable
        avatar={avatarData.url || user.avatar}
        background={backgroundData.url || user.background}
        alias={user.alias}
        biography={user.biography}
        interests={user.interests}
        categories={categories}
        loading={isLoading}
        onInterestSelect={onInterestSelectHandler}
        onAvatarSelect={onAvatarSelectHandler}
        onChangeAlias={onChangeAliasHandler}
        onChangeBiography={onChangeBiographyHandler}
        onBackgroundSelect={onBackgroundSelectHandler}
        onCancel={onCancelHandler}
        onSave={onSaveHandler}
      />
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
    </>
  );
};

const ProfileCardDefault: FC<{
  userId: string;
  onEdit: any;
  onSignOut: any;
}> = ({ userId, onEdit, ...props }) => {
  const [burst] = useState<number>(Math.random());
  const { data: user, isLoading } = useUser(userId, true);
  const [signOut] = useSignOut(getAuth());
  const router = useRouter();

  const onSignOutHandler = async () => {
    await signOut();
    router.push("/login/");
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <UserCard
      variant="big"
      {...user}
      avatar={`${user.avatar}&bust=${burst}`}
      background={`${user.background}&bust=${burst}`}
      // {...props}
    >
      <ButtonGroup variant="text">
        <Button onClick={onEdit}>Edit</Button>
        <Button onClick={onSignOutHandler}>Log Out</Button>
      </ButtonGroup>
    </UserCard>
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
