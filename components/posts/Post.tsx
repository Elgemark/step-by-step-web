import { Card, useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import UserAvatar from "../UserAvatar";
import Badge from "@mui/material/Badge";
import { useLikes, useBookmarks } from "../../utils/firebase/api";
import styled from "styled-components";
import { useState, FC, ReactNode } from "react";
import { CardActionArea } from "@mui/material";
import { Lists } from "../../utils/firebase/type";
import List from "../lists/List";
import { Media } from "../../utils/firebase/interface";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const Root = styled(Card)`
  .button-link {
    margin-left: auto;
  }
  .list {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
`;

const StyledCardMedia = styled(CardMedia)`
  object-fit: cover;
  max-height: 320px;
`;

const MediaContainer = ({ children, hrefBasePath, slug, enableLink }) => {
  if (enableLink) {
    return (
      <a href={`${hrefBasePath}${slug}`}>
        <CardActionArea>{children}</CardActionArea>
      </a>
    );
  } else {
    return children;
  }
};

const Post: FC<{
  uid: string;
  id: string;
  title: string;
  descr?: string;
  enableLink: boolean;
  hrefBasePath?: string;
  lists?: Lists;
  media: Media;
  likes: number;
  currentUserId?: string;
  action?: ReactNode | ReactJSXElement;
  onLike?: Function;
  onBookmark?: Function;
  onClickAvatar?: ({ uid }) => void;
}> = ({
  uid,
  currentUserId,
  title = "Title",
  descr = "Body",
  id,
  enableLink,
  hrefBasePath = "/steps/",
  lists = [],
  media = { imageURI: "" },
  action,
  likes = 0,
  onLike,
  onClickAvatar,
}) => {
  const theme = useTheme();
  const [numLikes, setNumLikes] = useState(likes);
  const { isLiked, toggle: toggleLike } = useLikes(id);
  const { isBookmarked, toggle: toogleBookmark } = useBookmarks(id);

  const onLikeHandler = () => {
    setNumLikes(numLikes + (isLiked ? -1 : 1));
    toggleLike();
    onLike();
  };

  const onBookmarkHandler = () => {
    toogleBookmark(id);
  };

  return (
    <Root theme={theme}>
      <CardHeader
        avatar={
          <IconButton sx={{ padding: 0 }} onClick={() => onClickAvatar({ uid })}>
            <UserAvatar userId={uid} />
          </IconButton>
        }
        action={action}
        title={<Typography>{title}</Typography>}
      />

      <MediaContainer slug={id} hrefBasePath={hrefBasePath} enableLink={enableLink}>
        {media?.imageURI && <StyledCardMedia component="img" image={media?.imageURI} />}
      </MediaContainer>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {descr}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        {/* LIKE */}
        {onLike && (
          <IconButton aria-label="like" onClick={onLikeHandler}>
            <Badge badgeContent={numLikes} color="success">
              {isLiked ? <FavoriteIcon color="warning" /> : <FavoriteBorderIcon />}
            </Badge>
          </IconButton>
        )}
        {/* SHARE */}
        {/* <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        {/* BOOKMARK */}
        {currentUserId && (
          <IconButton aria-label="bookmark" onClick={onBookmarkHandler}>
            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        )}
        {enableLink && (
          <IconButton className="button-link" aria-label="open-in-new-window" href={`/steps/${id}`} target="_blank">
            <OpenInNewIcon />
          </IconButton>
        )}
      </CardActions>
      {lists.length ? (
        <CardContent>
          {lists.map((list) => (
            <List {...list} />
          ))}
        </CardContent>
      ) : null}
    </Root>
  );
};

export default Post;
