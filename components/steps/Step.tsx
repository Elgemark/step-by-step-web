import { Card, Typography } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import CardMedia from "@mui/material/CardMedia";
import styled from "styled-components";
import { FC } from "react";
import settings from "../../config";
import StepMoreMenu from "../StepMoreMenu";

const StyledCardMedia = styled(CardMedia)`
  object-fit: contain;
`;

interface Media {
  imageURI: string;
}

const Step: FC<{
  postId: string;
  id: string;
  index: number;
  title: string;
  body: string;
  className: string;
  media: Media;
  onRollBack?: Function;
}> = ({ postId, id, index, title, body, media, onRollBack, className }) => {
  return (
    <Card className={className}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {index + 1}
          </Avatar>
        }
        title={<Typography>{title}</Typography>}
        action={<StepMoreMenu postId={postId} stepId={id} onRollBack={onRollBack} />}
      />
      {media?.imageURI && <StyledCardMedia component="img" height={settings.image.height} image={media.imageURI} />}
      <CardContent>
        <Typography variant="body2">{body}</Typography>
      </CardContent>
    </Card>
  );
};

export default Step;
