import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { FC } from "react";
import { Stack, useTheme } from "@mui/material";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import { Button, ButtonGroup } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import OpenDialog from "../primitives/OpenDialog";

const DefaultStyle = styled.div`
  border-radius: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 640px;
  min-height: 320px;
  position: relative;
  background-color: #272727;
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
    filter: brightness(0.8);
  }
`;

const RootSmall = styled(DefaultStyle)`
  max-width: 320px;
  min-height: 160px;
  max-height: 320px;
  .user-alias {
    margin-top: 30px;
  }
`;

const RootBig = styled(DefaultStyle)``;

const UserCardBig: FC<{
  children?: JSX.Element;
  alias?: string;
  biography?: string;
  avatar?: string;
  background: string;
}> = ({ alias, biography, avatar, background, children, ...props }) => {
  const theme = useTheme();

  return (
    <RootBig theme={theme} backgroundImage={background} {...props}>
      <Stack spacing={2} width="100%" height="100%" alignItems="center">
        <Avatar className="user-avatar" src={avatar} sx={{ width: 72, height: 72 }} />
        <Typography className="user-alias" variant="h4">
          {alias}
        </Typography>
        <Typography className="user-biography" variant="body1" color="text.secondary">
          {biography}
        </Typography>
        {children}
      </Stack>
    </RootBig>
  );
};

export const UserCardBigEditable: FC<{
  children?: JSX.Element;
  alias?: string;
  biography?: string;
  avatar?: string;
  background: string;
  onAvatarSelect: any;
  onChangeAlias: any;
  onChangeBiography: any;
  onBackgroundSelect: any;
  onCancel: any;
  onSave: any;
}> = ({
  alias,
  biography,
  avatar,
  background,
  onAvatarSelect,
  onChangeAlias,
  onChangeBiography,
  onBackgroundSelect,
  onCancel,
  onSave,
  ...props
}) => {
  const theme = useTheme();

  return (
    <RootBig theme={theme} backgroundImage={background} {...props}>
      <Stack spacing={2} width="100%" height="100%" alignItems="center">
        <Avatar className="user-avatar" src={avatar} sx={{ width: 72, height: 72 }} />
        <Stack direction="row">
          <OpenDialog className="button-change-avatar" onFileSelected={onAvatarSelect}>
            <Button endIcon={<ImageIcon></ImageIcon>}>avatar</Button>
          </OpenDialog>
          <OpenDialog className="button-change-background" onFileSelected={onBackgroundSelect}>
            <Button endIcon={<ImageIcon></ImageIcon>}>wallpaper</Button>
          </OpenDialog>
        </Stack>
        <TextField className="user-alias" fullWidth label="Alias" value={alias} onChange={onChangeAlias} />
        <TextField
          className="user-biography"
          fullWidth
          label="Biography"
          value={biography}
          multiline
          inputProps={{ maxLength: 120 }}
          maxRows={3}
          onChange={onChangeBiography}
        />

        <ButtonGroup variant="text">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onSave}>Save</Button>
        </ButtonGroup>
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
    <RootSmall theme={theme} backgroundImage={background} {...props}>
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
  alias?: string;
  biography?: string;
  avatar?: string;
  background: string;
}> = ({ variant, alias, biography, avatar, background, ...props }) => {
  switch (variant) {
    case "big":
      return <UserCardBig alias={alias} biography={biography} avatar={avatar} background={background} {...props} />;
    case "small":
      return <UserCardSmall alias={alias} biography={biography} avatar={avatar} background={background} {...props} />;
    default:
      return <div>{`Variant ${variant} is not applicable!`}</div>;
  }
};

export default UserCard;
