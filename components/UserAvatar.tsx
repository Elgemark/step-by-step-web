import Avatar from "@mui/material/Avatar";

// Firebase related
import { useAuthState, useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const UserAvatar = ({ size = 32, userId, ...props }) => {
  const [user, userLoading, userError] = useAuthState(getAuth());
  return (
    <Avatar alt={user?.displayName} src={user?.photoURL} sx={{ width: size, height: size }} {...props}>
      {user?.displayName.charAt(0) || "A"}
    </Avatar>
  );
};

export default UserAvatar;
