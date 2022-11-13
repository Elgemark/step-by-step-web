import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";

import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PostMoreMenu from "../PostMoreMenu";
import Link from "next/link";

const Post = ({ title = "Title", descr = "Body", media = {}, id, minWidth = 320, onEdit, onDelete, onReport }) => {
  return (
    <Card sx={{ minWidth: minWidth }} onClick={() => {}}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            R
          </Avatar>
        }
        action={<PostMoreMenu onEdit={onEdit} onDelete={onDelete} onReport={onReport} />}
        title={title}
        subheader="September 14, 2016"
      />
      <Link
        href={{
          pathname: "/steps/[slug]",
          query: { slug: id },
        }}
      >
        <CardMedia component="img" height="194" image={media.imageURI} />
      </Link>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {descr}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Post;
