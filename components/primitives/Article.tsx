import styled from "styled-components";
import { Avatar, Paper, useTheme } from "@mui/material";
import { backgroundBlurMixin } from "../../utils/styleUtils";

const Root = styled(Paper)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px 10px 10px 10px;
  ${backgroundBlurMixin}

  .article-content {
    padding: ${({ theme }) => `0 ${theme.spacing(4)} ${theme.spacing(4)}`};
  }

  .user-avatar {
    filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.5));
    box-sizing: content-box;
    margin-top: -60px;
  }
`;

const BackgroundImage = styled.div`
  margin-top: -10px;
  width: 100%;
  min-height: ${({ src }) => (src ? "400px" : "200px")};
  background-color: black;
  background-image: ${({ src }) => "url(" + src + ")"};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 10px 10px 10px 10px;
`;

const Article = ({ image, avatar, children, backgroundContent }) => {
  const theme = useTheme();
  return (
    <Root theme={theme}>
      <BackgroundImage src={image}>{backgroundContent}</BackgroundImage>
      <Avatar className="user-avatar" src={avatar} sx={{ width: 120, height: 120 }} />
      <div className="article-content">{children}</div>
    </Root>
  );
};

export default Article;
