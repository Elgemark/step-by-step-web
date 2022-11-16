import { Card, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import CardMedia from "@mui/material/CardMedia";

const Step = ({ index, title, body, media = {}, ...props }) => {
  return (
    <Card {...props}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {index + 1}
          </Avatar>
        }
        title={<Typography variant="h5">{title}</Typography>}
        // subheader="September 14, 2016"
      />
      <CardMedia component="img" height="300" image={media.imageURI} />
      <CardContent>
        <Typography>{body}</Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* <IconButton aria-label="save">
          <SaveIcon />
        </IconButton> */}
      </CardActions>
    </Card>
  );
};

export default Step;
