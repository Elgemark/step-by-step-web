import { Card, useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import UserAvatar from "../UserAvatar";
import Badge from "@mui/material/Badge";
import { useLikes, useBookmarks } from "../../utils/firebase/api";
import styled from "styled-components";
import { useState, FC, ReactNode } from "react";
import { CardActionArea } from "@mui/material";
import List from "../lists/List";
import { Media } from "../../utils/firebase/interface";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { useCollection } from "../../utils/firebase/hooks/collections";
import { ListItems, Lists } from "../../utils/firebase/api/list";
import { Progress } from "../../utils/firebase/api/progress";
import _ from "lodash";
import CardImage from "../CardImage";
import Rate from "../primitives/Rate";
import { backgroundBlurMixin } from "../../utils/styleUtils";

const Root = styled(Card)`
  ${backgroundBlurMixin}

  .button-link {
    margin-left: auto;
  }
  .list {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
  .rate-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
  }
  .MuiCardContent-root {
    margin-top: ${({ theme }) => theme.spacing(-2)};
  }
`;

const StyledCardImage = styled(CardImage)`
  object-fit: cover;
  max-height: 320px;
  cursor: ${({ enableLink }) => (enableLink ? "pointer" : "auo")};
`;

const MediaContainer = ({ children, hrefBasePath, slug, enableLink, title }) => {
  if (enableLink) {
    return (
      <a href={`${hrefBasePath}${slug}`} title={title}>
        <CardActionArea>{children}</CardActionArea>
      </a>
    );
  } else {
    return children;
  }
};

const ListController: FC<{ postId: string; listId: string; listTitle: string; progress: Progress }> = ({
  postId,
  listId,
  listTitle,
  progress,
}) => {
  const { data: listItems } = useCollection(["posts", postId, "lists", listId, "items"]);
  const calculatedListItems = listItems.map((item) => {
    const currentStep = _.last(progress.stepsCompleted);
    const previousSteps = _.slice(progress.stepsCompleted, 0, progress.stepsCompleted.length - 1);
    return {
      ...item,
      highlight: item.stepId && item.stepId === currentStep,
      consumed: previousSteps.includes(item.stepId),
      badgeContent: (item.stepId && item.stepId === currentStep && progress.stepsCompleted.length) || null,
    };
  });
  return <List title={listTitle} items={calculatedListItems as ListItems} />;
};

const Post: FC<{
  uid: string;
  id: string;
  slug?: string;
  title: string;
  descr?: string;
  enableLink: boolean;
  hrefBasePath?: string;
  lists?: Lists;
  progress?: Progress;
  media: Media;
  ratesNum?: number;
  ratesTotal?: number;
  currentUserId?: string;
  action?: ReactNode | ReactJSXElement;
  onBookmark?: Function;
  onClickAvatar?: ({ uid }) => void;
}> = ({
  uid,
  currentUserId,
  title = "Title",
  descr = "Body",
  id,
  slug,
  enableLink,
  hrefBasePath = "/steps/",
  lists = [],
  progress,
  media = { imageURI: "" },
  action,
  ratesNum = 0,
  ratesTotal = 0,
  onClickAvatar,
}) => {
  const theme = useTheme();
  const { isBookmarked, toggle: toogleBookmark } = useBookmarks(id);

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

      <MediaContainer slug={slug || id} hrefBasePath={hrefBasePath} enableLink={enableLink} title={title}>
        <StyledCardImage src={media.imageURI} enableLink={enableLink} enableFullscreen={!enableLink} alt={title} />
      </MediaContainer>

      <CardActions disableSpacing>
        {/* LIKE */}
        {/* {onLike && (
          <IconButton aria-label="like" onClick={onLikeHandler}>
            <Badge badgeContent={numLikes} color="success">
              {isLiked ? <FavoriteIcon color="warning" /> : <FavoriteBorderIcon />}
            </Badge>
          </IconButton>
        )} */}

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
        {/* RATE */}
        {ratesNum > 0 ? (
          <div className="rate-container">
            <Badge badgeContent={ratesNum} color="success">
              <Rate value={ratesTotal / ratesNum} size="small" spacing={-0.8} />
            </Badge>
          </div>
        ) : null}
        {enableLink && (
          <IconButton className="button-link" aria-label="open-in-new-window" href={`/steps/${id}`} target="_blank">
            <OpenInNewIcon />
          </IconButton>
        )}
      </CardActions>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {descr}
        </Typography>
      </CardContent>
      {lists.length && progress ? (
        <CardContent>
          {lists.map((list) => (
            // <List {...list} />
            <ListController postId={id} listId={list.id} listTitle={list.title} progress={progress as Progress} />
          ))}
        </CardContent>
      ) : null}
    </Root>
  );
};

export default Post;
