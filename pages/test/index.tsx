import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import MUIWrapper from "../../components/wrappers/MUIWrapper";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styled from "styled-components";

const Root = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const TestPage = () => {
  const [user, isLoading] = useAuthState(getAuth());
  console.log("user", isLoading);
  return (
    <Root>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            ---
          </Typography>
          <Typography variant="h5" component="div">
            This is a test page!
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            ---
          </Typography>
          <Typography variant="body2">---</Typography>
        </CardContent>
      </Card>
    </Root>
  );
};

export async function getServerSideProps() {
  return { props: {} };
}

export default (props) => (
  <MUIWrapper>
    <TestPage />
  </MUIWrapper>
);
