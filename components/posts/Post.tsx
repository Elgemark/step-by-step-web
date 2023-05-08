import { Card, useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import UserAvatar from "../UserAvatar";
import Badge from "@mui/material/Badge";
import styled from "styled-components";
import { FC, ReactNode } from "react";
import { CardActionArea } from "@mui/material";
import { Media } from "../../utils/firebase/interface";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import _ from "lodash";
import CardImage from "../CardImage";
import Rate from "../primitives/Rate";
import { backgroundBlurMixin } from "../../utils/styleUtils";
import BookmarkButton from "../client/BookmarkButton";

const Root = styled(Card)`
  ${backgroundBlurMixin}

  .button-link {
    margin-left: auto;
  }
  .rate-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
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

const Post: FC<{
  uid: string;
  id: string;
  slug?: string;
  title: string;
  descr?: string;
  enableLink: boolean;
  hrefBasePath?: string;
  media: Media;
  ratesNum?: number;
  ratesTotal?: number;
  currentUserId?: string;
  action?: ReactNode | ReactJSXElement;
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
  media = { imageURI: "" },
  action,
  ratesNum = 0,
  ratesTotal = 0,
  onClickAvatar,
}) => {
  const theme = useTheme();

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
        {/* BOOKMARK */}
        {currentUserId && <BookmarkButton postId={id} />}
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
    </Root>
  );
};

export default Post;
