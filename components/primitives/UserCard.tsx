import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { FC } from "react";
import { Stack, useTheme } from "@mui/material";
import styled from "styled-components";

const RootBig = styled.div`
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
        <Typography className="user-biography" variant="body2" color="text.secondary">
          {biography}
        </Typography>
        {children}
      </Stack>
    </RootBig>
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
    default:
      return <>{`Variant ${variant} is not applicable!`}</>;
  }
};

export default UserCard;
