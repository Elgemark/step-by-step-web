import { Card } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { red } from "@mui/material/colors";
import SaveIcon from "@mui/icons-material/Save";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { usePaste } from "../../utils/imageUtils";
import { useUploadFileAsBlob } from "../../utils/firebase/api";

const SplashEditable = ({ title = "Title", body = "Body", media = {} }) => {
  const { imageURI, blob, onPaste } = usePaste();
  const { upload, downloadURL } = useUploadFileAsBlob();

  console.log("downloadURL", downloadURL);

  useEffect(() => {
    if (blob) {
      upload(blob);
    }
  }, [blob]);

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
            R
          </Avatar>
        }
        title={<TextField fullWidth label="Title" placeholder="Title" onPaste={onPaste} />}
        // subheader="September 14, 2016"
      />
      <CardMedia component="img" height="194" image={downloadURL || imageURI || media.imageURI} onPaste={onPaste} />
      <CardContent>
        <TextField fullWidth multiline label="body" placeholder="body" />
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="share">
          <SaveIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default SplashEditable;
