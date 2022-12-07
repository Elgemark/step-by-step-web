import Avatar from "@mui/material/Avatar";
// Firebase related
import { FC } from "react";
import { useUser } from "../utils/firebase/api";

const UserAvatar: FC<{ size?: number; userId?: string; realtime?: boolean }> = ({
  size = 32,
  userId,
  realtime = false,
  ...props
}) => {
  const { data: user } = useUser(userId, realtime);

  return (
    <Avatar alt={user?.alias} src={user?.avatar} sx={{ width: size, height: size }} {...props}>
      {user?.alias?.charAt(0) || ""}
    </Avatar>
  );
};

export default UserAvatar;
