import { Card } from "@mui/material";
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
import ReportDialogContent from "../primitives/ReportDialogContent";
import Dialog from "@mui/material/Dialog";
import { setReport } from "../../utils/firebase/api/report";
import { useMessages } from "../../hooks/message";

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
  if (enableLink) {
    return (
      // <Link href={href} >
      <a href={`/steps/${href.query.slug}`}>
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
  lists?: Lists;
  media: Media;
  likes: number;
  currentUserId?: string;
  onEdit?: Function;
  onDelete?: Function;
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
  onLike,
  onStartOver,
  onClickAvatar,
}) => {
  const [numLikes, setNumLikes] = useState(likes);
  const { isLiked, toggle: toggleLike } = useLikes(id);
  const { isBookmarked, toggle: toogleBookmark } = useBookmarks(id);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const { addMessage } = useMessages();

  const onLikeHandler = () => {
    setNumLikes(numLikes + (isLiked ? -1 : 1));
    toggleLike();
    onLike();
  };

  const onBookmarkHandler = () => {
    toogleBookmark(id);
  };

  const onReportHandler = () => {
    setShowReportDialog(true);
  };

  const onClickSendReportHandler = (report) => {
    setShowReportDialog(false);
    setReport(id, userId, report)
      .then((e) => {
        if (!e.error) {
          addMessage({ id: "alert", message: "Report sent successfully!" });
        } else {
          addMessage({ id: "alert", message: "An error occured. Please try againg!" });
        }
      })
      .catch((e) => {
        addMessage({ id: "alert", message: "An error occured. Please try againg!" });
      });
  };

  return (
    <Root>
      <CardHeader
        avatar={
          <IconButton sx={{ padding: 0 }} onClick={() => onClickAvatar(userId)}>
            <UserAvatar userId={userId} />
          </IconButton>
        }
        action={
          <PostMoreMenu onEdit={onEdit} onDelete={onDelete} onReport={onReportHandler} onStartOver={onStartOver} />
        }
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

      {/* REPORT */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)}>
        <ReportDialogContent onClickCancel={() => setShowReportDialog(false)} onClickSend={onClickSendReportHandler} />
      </Dialog>
    </Root>
  );
};

export default Post;
