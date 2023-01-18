import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function IndexPage() {
  const [user, isLoading] = useAuthState(getAuth());
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/posts/user/" + user.uid);
      } else {
        router.replace("/posts/");
      }
    }
  }, [user, isLoading]);

  return <CircularProgress></CircularProgress>;
}
