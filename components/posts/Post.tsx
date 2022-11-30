import { Card } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import PostMoreMenu from "../PostMoreMenu";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import Badge from "@mui/material/Badge";
import { useIsPostLikedByUser } from "../../utils/firebase/api";
import styled from "styled-components";
import TablePrerequisites from "../TablePrerequisites";
import PropTypes from "prop-types";
import { useState } from "react";

const StyledCardMedia = styled(CardMedia)`
  object-fit: cover;
`;

const Post = ({
  title = "Title",
  descr = "Body",
  userId,
  id,
  prerequisites = [],
  media = { imageURI: "" },
  minWidth = 320,
  likes = 0,
  onEdit,
  onDelete,
  onReport,
  onLike,
}) => {
  const [numLikes, setNumLikes] = useState(likes);

  const { isLiked, toggle } = useIsPostLikedByUser(id);

  const onLikeHandler = () => {
    setNumLikes(numLikes + (isLiked ? -1 : 1));
    toggle();
    onLike();
  };

  return (
    <Card sx={{ minWidth: minWidth }} onClick={() => {}}>
      <CardHeader
        avatar={<UserAvatar />}
        action={<PostMoreMenu onEdit={onEdit} onDelete={onDelete} onReport={onReport} />}
        title={<Typography>{title}</Typography>}
      />
      <Link
        href={{
          pathname: "/steps/[slug]",
          query: { slug: id },
        }}
      >
        {media?.imageURI && <StyledCardMedia height="300" component="img" image={media?.imageURI} />}
      </Link>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {descr}
        </Typography>
        <TablePrerequisites items={prerequisites} />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="like" onClick={onLikeHandler}>
          <Badge badgeContent={numLikes} color="success">
            <FavoriteIcon color={isLiked ? "warning" : "inherit"} />
          </Badge>
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

Post.propTypes = {
  userId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onReport: PropTypes.func,
  onLike: PropTypes.func,
};

export default Post;
