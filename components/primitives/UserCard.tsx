import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { FC } from "react";
import { Chip, InputLabel, Stack, useTheme } from "@mui/material";
import styled, { css } from "styled-components";
import TextField from "@mui/material/TextField";
import { Button, ButtonGroup } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import OpenDialog from "../primitives/OpenDialog";
import { LoadingButton } from "@mui/lab";
import SelectChips, { ChipItem } from "./SelectChips";
import { Categories } from "../../utils/firebase/api/categories";
import BorderBox from "./BorderBox";

const RootSmall = styled.div`
  border-radius: ${({ spacing }) => spacing(1)};
  padding: ${({ spacing }) => spacing(2)};
  margin-top: ${({ spacing }) => spacing(5)};
  margin-bottom: ${({ spacing }) => spacing(2)};
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  background-color: #272727;
  background-image: ${({ backgroundImage }) => "url(" + backgroundImage + ")"};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  max-width: 320px;
  min-height: 160px;
  max-height: 320px;
  hr {
    width: 100%;
    margin: ${({ spacing }) => spacing(2)};
  }
  .user-avatar {
    margin-top: -50px;
    border: 8px solid ${({ palette }) => (palette.mode === "dark" ? "black" : "white")};
    box-sizing: content-box;
  }
  .user-selectedCategories {
    flex-grow: 1;
  }
  .user-wallpaper {
    position: absolute;
    bottom: 0;
    width: 100%;
    filter: brightness(0.8);
  }
  .chip {
    margin-right: ${({ spacing }) => spacing(1)};
    margin-bottom: ${({ spacing }) => spacing(1)};
  }

  .user-alias {
    margin-top: 26px;
  }
`;

const RootBig = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: -10px;
  background-color: #272727;
  border-radius: 0 0 10px 10px;
  position: relative;
  width: 100%;
  .background {
    margin-top: -10px;
    width: 100%;
    min-height: ${({ src }) => (src ? "400px" : "200px")};
    background-color: black;
    background-image: ${({ src }) => "url(" + src + ")"};
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    border-radius: 0 0 10px 10px;
  }
  .user-avatar {
    border: 8px solid ${({ palette }) => (palette.mode === "dark" ? "#272727" : "white")};
    box-sizing: content-box;
    margin-top: -60px;
  }
  .profile-content {
    padding: 0 32px 32px;
    max-width: 600px;
  }
  .border-box {
    width: 100%;
  }
  .border-box .content-container {
    justify-content: flex-start;
  }
  .Mui-disabled textarea,
  .Mui-disabled input {
    color: white;
    -webkit-text-fill-color: white;
    opacity: 1;
  }
`;

export const UserCardBig: FC<{
  children?: JSX.Element;
  alias?: string;
  biography?: string;
  avatar?: string;
  selectedCategories?: Categories;
  categories: Categories;
  background: string;
  loading?: boolean;
  edit?: boolean;
  onAvatarSelect?: any;
  onCategorySelect?: any;
  onChangeAlias?: any;
  onChangeBiography?: any;
  onBackgroundSelect?: any;
  onCancel?: any;
  onSave?: any;
  onEdit?: any;
  onSignOut?: any;
  [key: string]: any;
}> = ({
  alias,
  biography,
  avatar,
  selectedCategories = [],
  categories = [],
  background,
  loading,
  edit = false,
  onCategorySelect,
  onAvatarSelect,
  onChangeAlias,
  onChangeBiography,
  onBackgroundSelect,
  onCancel,
  onSave,
  onEdit,
  onSignOut,
  ...props
}) => {
  const theme = useTheme();

  return (
    <RootBig spacing={theme.spacing} palette={theme.palette} src={background} {...props}>
      <div className="background"></div>
      <Stack spacing={2} width="100%" height="100%" alignItems="center" className="profile-content">
        <Avatar className="user-avatar" src={avatar} sx={{ width: 120, height: 120 }} />
        <Stack direction="row">
          <OpenDialog className="button-change-avatar" onFileSelected={onAvatarSelect}>
            <Button endIcon={<ImageIcon></ImageIcon>}>avatar</Button>
          </OpenDialog>
          <OpenDialog className="button-change-background" onFileSelected={onBackgroundSelect}>
            <Button endIcon={<ImageIcon></ImageIcon>}>wallpaper</Button>
          </OpenDialog>
        </Stack>
        <TextField
          className="user-alias"
          fullWidth
          label="Alias"
          value={alias}
          onChange={onChangeAlias}
          disabled={!edit}
        />
        <TextField
          className="user-biography"
          fullWidth
          label="Biography"
          value={biography}
          multiline
          inputProps={{ maxLength: 120 }}
          maxRows={3}
          onChange={onChangeBiography}
          disabled={!edit}
        />
        <BorderBox label="Interests (max 3)" className="border-box">
          <SelectChips
            items={categories.map((category) => ({ label: category.text, value: category.value } as ChipItem))}
            selectedItems={selectedCategories}
            onSelect={(category) => onCategorySelect({ category })}
          />
        </BorderBox>
        {edit ? (
          <ButtonGroup variant="text">
            <Button onClick={onCancel}>Cancel</Button>
            <LoadingButton loading={loading} onClick={onSave}>
              Save
            </LoadingButton>
          </ButtonGroup>
        ) : (
          <ButtonGroup variant="text">
            <Button onClick={onEdit}>Edit</Button>
            <Button onClick={onSignOut}>Log Out</Button>
          </ButtonGroup>
        )}
      </Stack>
    </RootBig>
  );
};

const UserCardSmall: FC<{
  children?: JSX.Element;
  alias?: string;
  biography?: string;
  avatar?: string;
  background: string;
}> = ({ alias, biography, avatar, background, children, ...props }) => {
  const theme = useTheme();

  return (
    <RootSmall spacing={theme.spacing} palette={theme.palette} backgroundImage={background} {...props}>
      <Stack spacing={2} width="100%" height="100%" alignItems="center">
        <Avatar className="user-avatar" src={avatar} sx={{ width: 56, height: 56 }} />
        <Typography className="user-alias" variant="h5">
          {alias}
        </Typography>
      </Stack>
    </RootSmall>
  );
};

const UserCard: FC<{
  variant: "big" | "small";
  edit: boolean;
  alias?: string;
  biography?: string;
  avatar?: string;
  background: string;
}> = ({ variant, alias, biography, avatar, background, edit, ...props }) => {
  switch (variant) {
    case "big":
      return (
        <UserCardBig
          edit={edit}
          alias={alias}
          biography={biography}
          avatar={avatar}
          background={background}
          {...props}
        />
      );
    case "small":
      return <UserCardSmall alias={alias} biography={biography} avatar={avatar} background={background} {...props} />;
    default:
      return <div>{`Variant ${variant} is not applicable!`}</div>;
  }
};

export default UserCard;
