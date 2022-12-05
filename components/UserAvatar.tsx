import Avatar from "@mui/material/Avatar";
// Firebase related
import { FC } from "react";
import { useUser } from "../utils/firebase/api";

const UserAvatar: FC<{ size?: number }> = ({ size = 32, ...props }) => {
  const { data: user } = useUser();

  return (
    <Avatar alt={user?.alias} src={user?.avatar} sx={{ width: size, height: size }} {...props}>
      {user?.alias?.charAt(0) || "A"}
    </Avatar>
  );
};

export default UserAvatar;
