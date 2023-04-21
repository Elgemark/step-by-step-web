import { Card, Typography, useTheme } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import styled from "styled-components";
import { FC } from "react";
import StepMoreMenu from "../StepMoreMenu";
import CardImage from "../CardImage";
import { backgroundBlurMixin } from "../../utils/styleUtils";

const Root = styled(Card)`
  ${backgroundBlurMixin}
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
  const theme = useTheme();
  return (
    <Root className={className} theme={theme}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            {index + 1}
          </Avatar>
        }
        title={<Typography>{title}</Typography>}
        action={<StepMoreMenu postId={postId} stepId={id} onRollBack={onRollBack} />}
      />
      <CardImage src={media.imageURI} enableFullscreen alt={title} />
      <CardContent>
        <Typography variant="body2">{body}</Typography>
      </CardContent>
    </Root>
  );
};

export default Step;
