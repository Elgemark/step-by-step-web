import Typography from "@mui/material/Typography";
import UserAvatar from "./UserAvatar";
import { useUser } from "../utils/firebase/api";
import { FC } from "react";
import { CircularProgress, Paper, Stack, useTheme } from "@mui/material";
import styled from "styled-components";

interface User {
  alias: string;
  description: string;
  id: string;
}

const StyledDefault = styled.div`
  padding: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSmall = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  display: flex;
  .user-avatar {
    margin-right: ${({ theme }) => theme.spacing(2)};
  }
`;

const CardDefault: FC<{
  user: User;
}> = ({ user, ...props }) => {
  const theme = useTheme();

  return (
    <StyledDefault theme={theme} {...props}>
      <Stack spacing={2} width="100%" alignItems="center">
        <UserAvatar className="user-avatar" size={72} userId={user.id} realtime />
        <Typography className="user-alias" variant="h4">
          {user.alias}
        </Typography>
        <Typography className="user-description" variant="body2" color="text.secondary">
          {user.description || ""}
        </Typography>
      </Stack>
    </StyledDefault>
  );
};

const CardSmall: FC<{
  user: User;
}> = ({ user, ...props }) => {
  const theme = useTheme();

  return (
    <StyledSmall theme={theme} elevation={2} {...props}>
      <UserAvatar className="user-avatar" size={36} userId={user.id} realtime />
      <Stack direction={"column"} spacing={2}>
        <Typography className="user-alias" variant="h6">
          {user.alias}
        </Typography>
        {user.description && (
          <Typography className="user-description" variant="body2" color="text.secondary">
            {user.description}
          </Typography>
        )}
      </Stack>
    </StyledSmall>
  );
};

const UserCard: FC<{
  userId: string;
  variant?: "default" | "small";
}> = (props) => {
  const { userId, variant = "default" } = props;
  const { data: user, isLoading } = useUser(userId);

  return (
    <>
      {(isLoading && <CircularProgress />) ||
        (variant === "default" && <CardDefault user={user} />) ||
        (variant === "small" && <CardSmall user={user} />) ||
        null}
    </>
  );
};

export default UserCard;
