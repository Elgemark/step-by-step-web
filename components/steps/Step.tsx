import { Card, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import CardMedia from "@mui/material/CardMedia";
import styled from "styled-components";

const StyledCardMedia = styled(CardMedia)`
  object-fit: contain;
`;

const Step = ({ index, title, body, media = {}, className, ...props }) => {
  return (
    <Card {...props} className={className}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {index + 1}
          </Avatar>
        }
        title={<Typography variant="h5">{title}</Typography>}
        // subheader="September 14, 2016"
      />
      {media.imageURI && <StyledCardMedia component="img" height="300" image={media.imageURI} />}
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
