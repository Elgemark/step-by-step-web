import { useEffect } from "react";
import { useRouter } from "next/router";
import FirebaseWrapper from "../components/FirebaseWrapper";
import { useUser } from "reactfire";
import Loader from "../components/Loader";

const IndexPage = () => {
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

  return <Loader message="Loading..."></Loader>;
};

export default () => (
  <FirebaseWrapper>
    <IndexPage />
  </FirebaseWrapper>
);
