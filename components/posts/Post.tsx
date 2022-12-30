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
import PostMoreMenu from "../PostMoreMenu";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import Badge from "@mui/material/Badge";
import { useLikes, useBookmarks } from "../../utils/firebase/api";
import styled from "styled-components";
import { useState, FC } from "react";
import { CardActionArea } from "@mui/material";
import { Lists } from "../../utils/firebase/type";
import List from "../lists/List";
import { Media } from "../../utils/firebase/interface";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const Root = styled(Card)`
  .button-link {
    margin-left: auto;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  object-fit: cover;
  max-height: 320px;
`;

const MediaContainer = ({ children, href, enableLink }) => {
  console.log("href", href);
  if (enableLink) {
    return (
      // <Link href={href} >
      <a href={`/steps/${href.query.slug}`} target="_blank">
        <CardActionArea>{children}</CardActionArea>
      </a>
      // </Link>
    );
  } else {
    return children;
  }
};

const Post: FC<{
  userId: string;
  id: string;
  title: string;
  descr?: string;
  enableLink: boolean;
  lists: Lists;
  media: Media;
  likes: number;
  currentUserId?: string;
  onEdit?: Function;
  onDelete?: Function;
  onReport?: Function;
  onLike?: Function;
  onBookmark?: Function;
  onStartOver?: Function;
  onClickAvatar?: Function;
}> = ({
  userId,
  currentUserId,
  title = "Title",
  descr = "Body",
  id,
  enableLink,
  lists = [],
  media = { imageURI: "" },
  likes = 0,
  onEdit,
  onDelete,
  onReport,
  onLike,
  onStartOver,
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
          <IconButton sx={{ padding: 0 }} onClick={() => onClickAvatar(userId)}>
            <UserAvatar userId={userId} />
          </IconButton>
        }
        action={<PostMoreMenu onEdit={onEdit} onDelete={onDelete} onReport={onReport} onStartOver={onStartOver} />}
        title={<Typography>{title}</Typography>}
      />

      <MediaContainer
        href={{
          pathname: "/steps/[slug]",
          query: { slug: id },
        }}
        enableLink={enableLink}
      >
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
