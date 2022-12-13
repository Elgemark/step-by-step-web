import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import UserAvatar from "./UserAvatar";
import { useUser } from "../utils/firebase/api";
import { FC } from "react";
import { Stack, useTheme } from "@mui/material";
import { MouseEventHandler } from "react";
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
  .button-follow {
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;

const UserCard: FC<{
  onFollow: MouseEventHandler<HTMLButtonElement>;
  onUnfollow: MouseEventHandler<HTMLButtonElement>;
  userId?: string;
  isFollowing: boolean;
  loadingFollower: boolean;
}> = ({ onFollow, onUnfollow, userId, isFollowing, loadingFollower = false, ...props }) => {
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
    </Root>
  );
};

export default UserCard;