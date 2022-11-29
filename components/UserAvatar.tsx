import Avatar from "@mui/material/Avatar";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { FC } from "react";

const UserAvatar: FC<{ size?: number }> = ({ size = 32, ...props }) => {
  const [user] = useAuthState(getAuth());
  return (
    <Avatar alt={user?.displayName} src={user?.photoURL} sx={{ width: size, height: size }} {...props}>
      {user?.displayName?.charAt(0) || "A"}
    </Avatar>
  );
};

export default UserAvatar;
