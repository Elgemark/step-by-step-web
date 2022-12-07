import { Card } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PostMoreMenu from "../PostMoreMenu";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import Badge from "@mui/material/Badge";
import { useLikes, useBookmarks } from "../../utils/firebase/api";
import styled from "styled-components";
import TablePrerequisites from "../TablePrerequisites";
import PropTypes from "prop-types";
import { useState } from "react";
import { CardActionArea } from "@mui/material";
import settings from "../../config";

const StyledCardMedia = styled(CardMedia)`
  object-fit: cover;
  max-height: 320px;
`;

const MediaContainer = ({ children, href, enableLink }) => {
  if (enableLink) {
    return (
      <Link href={href}>
        <CardActionArea>{children}</CardActionArea>
      </Link>
    );
  } else {
    return children;
  }
};

const Post = ({
  title = "Title",
  descr = "Body",
  id,
  enableLink,
  prerequisites = [],
  media = { imageURI: "" },
  minWidth = 320,
  likes = 0,
  onEdit,
  onDelete,
  onReport,
  onLike,
  onBookmark,
  onStartOver,
}) => {
  const [numLikes, setNumLikes] = useState(likes);
  const { isLiked, toggle: toggleLike } = useLikes(id);
  const { isBookmarked, toggle: toogleBookmark } = useBookmarks(id);

  const onLikeHandler = () => {
    setNumLikes(numLikes + (isLiked ? -1 : 1));
    toggleLike();
    onLike();
  };

  const onBookmarkHandler = () => {
    toogleBookmark();
    onBookmark();
  };

  return (
    <Card>
      <CardHeader
        avatar={<UserAvatar />}
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
        {media?.imageURI && <StyledCardMedia height={settings.image.height} component="img" image={media?.imageURI} />}
      </MediaContainer>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {descr}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        {/* LIKE */}
        <IconButton aria-label="like" onClick={onLikeHandler}>
          <Badge badgeContent={numLikes} color="success">
            <FavoriteIcon color={isLiked ? "warning" : "inherit"} />
          </Badge>
        </IconButton>
        {/* SHARE */}
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        {/* FAVOURITE */}
        <IconButton aria-label="bookmark" onClick={onBookmarkHandler}>
          {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      </CardActions>
      <CardContent>
        <TablePrerequisites items={prerequisites} />
      </CardContent>
    </Card>
  );
};

Post.propTypes = {
  userId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  href: PropTypes.string,
  enableLink: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func,
  onLike: PropTypes.func,
};

export default Post;
