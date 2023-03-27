import { useUser } from "../../utils/firebase/api";
import { useState, FC, useEffect } from "react";
import { Button, ButtonGroup, CircularProgress, Modal } from "@mui/material";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { useStateObject } from "../../utils/object";
import ImageEditor from "../ImageEditor";
import appSettings from "../../config";
import { uploadImage } from "../../utils/firebase/api/storage";
import { UploadResponse } from "../../utils/firebase/interface";
import UserCard, { UserCardBig } from "../primitives/UserCard";
import { useCategories } from "../../utils/firebase/api/categories";
import _ from "lodash";
import { useRouter } from "next/router";
import { useUserStats } from "../../utils/firebase/api/user";

const ProfileSctionEditable: FC<{
  userId?: string;

  onSave: Function;
  onCancel: Function;
  onEdit: any;
  onSignOut: any;
}> = ({ userId, onSave, onCancel, onEdit, onSignOut }) => {
  const [isSaving, setIsSaving] = useState(false);
  const { data: user, update: updateUser, save: saveUser, isLoading } = useUser(userId);
  const { followersCount, followsCount } = useUserStats(userId);
  const { categories } = useCategories();
  const [edit, setEdit] = useState(false);
  const [signOut] = useSignOut(getAuth());
  const router = useRouter();

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

  const onEditHandler = () => {
    onEdit();
    setEdit(true);
  };

  const onSaveHandler = async () => {
    setIsSaving(true);
    const update = _.pick(user, ["biography", "alias", "categories"]);
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
      setEdit(false);
    }

    const resp = await saveUser(update);
    console.log("resp", { resp, update });
    setIsSaving(false);
    setEdit(false);
    onSave();
  };

  const onCancelHandler = () => {
    onCancel();
    setEdit(false);
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

  const onCategorySelectHandler = ({ category }) => {
    const newUserCategories = user.categories ? [...user.categories] : [];
    if (newUserCategories.includes(category.value)) {
      _.pull(newUserCategories, category.value);
    } else {
      newUserCategories.push(category.value);
    }
    console.log("newUserCategories", newUserCategories);
    // Max 3!
    if (newUserCategories.length <= 3) {
      updateUser("categories", newUserCategories);
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

  const onSignOutHandler = async () => {
    await signOut();
    router.push("/login/");
  };

  if (isLoading) {
    return <></>;
  }

  return (
    <>
      <UserCardBig
        edit={edit}
        editable={true}
        followersCount={followersCount}
        followsCount={followsCount}
        avatar={avatarData.url || user.avatar}
        background={backgroundData.url || user.background}
        alias={user.alias}
        biography={user.biography}
        selectedCategories={user.categories}
        categories={categories}
        loading={isLoading}
        onCategorySelect={onCategorySelectHandler}
        onAvatarSelect={onAvatarSelectHandler}
        onChangeAlias={onChangeAliasHandler}
        onChangeBiography={onChangeBiographyHandler}
        onBackgroundSelect={onBackgroundSelectHandler}
        onCancel={onCancelHandler}
        onSave={onSaveHandler}
        onEdit={onEditHandler}
        onSignOut={onSignOutHandler}
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

const ProfileSction = (props) => {
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

  return (
    <ProfileSctionEditable
      edit={edit}
      onSave={onSaveHandler}
      onCancel={onCancelHandler}
      onEdit={onEditHandler}
      {...props}
    />
  );
};

export default ProfileSction;
