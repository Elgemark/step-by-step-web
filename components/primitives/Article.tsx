import styled from "styled-components";
import { Avatar, Paper, useTheme } from "@mui/material";
import { backgroundBlurMixin } from "../../utils/styleUtils";
import React, { FC } from "react";

const Root = styled(Paper)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border-radius: 10px 10px 10px 10px;
  ${backgroundBlurMixin}

  .article-content {
    padding: ${({ theme }) => `0 ${theme.spacing(4)} ${theme.spacing(4)}`};
    max-width: 800px;
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
  height: ${({ src }) => (src ? "calc(100vw * 0.45)" : 0)};
  max-height: 400px;
  background-color: black;
  background-image: ${({ src }) => "url(" + src + ")"};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 10px 10px 10px 10px;
`;

const Article: FC<{
  image?: string;
  imageAlt?: string;
  avatar?: string;
  avatarAlt?: string;
  children: React.ReactNode;
  backgroundContent?: React.ReactNode;
}> = ({
  image,
  avatar,
  imageAlt = "Article background image",
  avatarAlt = "Avatar",
  children,
  backgroundContent,
  ...rest
}) => {
  const theme = useTheme();
  return (
    <Root theme={theme} {...rest}>
      {image ? (
        <BackgroundImage src={image} aria-label={imageAlt}>
          {backgroundContent}
        </BackgroundImage>
      ) : null}
      <Avatar className="user-avatar" src={avatar} alt={avatarAlt} sx={{ width: 120, height: 120 }} />
      <article className="article-content">{children}</article>
    </Root>
  );
};

export default Article;
