import { useEffect } from "react";
import { useRouter } from "next/router";
import FirebaseWrapper from "../components/wrappers/FirebaseWrapper";
import { useUser } from "reactfire";
import Loader from "../components/Loader";
import MUIWrapper from "../components/wrappers/MUIWrapper";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

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

  return (
    <Root>
      <Loader message="Loading..."></Loader>
    </Root>
  );
};

export default () => (
  <MUIWrapper>
    <FirebaseWrapper>
      <IndexPage />
    </FirebaseWrapper>
  </MUIWrapper>
);
