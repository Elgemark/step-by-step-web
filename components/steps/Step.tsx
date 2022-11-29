import { Card, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import CardMedia from "@mui/material/CardMedia";
import styled from "styled-components";
import { FC } from "react";

const StyledCardMedia = styled(CardMedia)`
  object-fit: contain;
`;

interface Media {
  imageURI: string;
}

const Step: FC<{ index: number; title: string; body: string; className: string; media: Media }> = ({
  index,
  title,
  body,
  media,
  className,
  ...props
}) => {
  return (
    <Card {...props} className={className}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {index + 1}
          </Avatar>
        }
        title={<Typography>{title}</Typography>}
      />
      {media.imageURI && <StyledCardMedia component="img" height="300" image={media.imageURI} />}
      <CardContent>
        <Typography variant="body2">{body}</Typography>
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
