import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/router";
import FirebaseWrapper from "../components/FirebaseWrapper";
import { useUser } from "reactfire";

const Content = () => {
  const { status, data: user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      if (user) {
        router.replace("/posts/user/" + user.uid);
      } else {
        router.replace("/posts/");
      }
    }
  }, [user, status]);

  return <CircularProgress></CircularProgress>;
};

export default function IndexPage() {
  return (
    <FirebaseWrapper>
      <Content />
    </FirebaseWrapper>
  );
}
