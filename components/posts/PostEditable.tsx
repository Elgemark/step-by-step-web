import { Card, Chip, Collapse } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import MediaEditable from "../primitives/MediaEditable";
import { useState } from "react";
import SelectCategory from "../primitives/SelectCategory";
import SettingsIcon from "@mui/icons-material/Settings";
import AddText from "../primitives/AddText";

const PostEditable = ({
  title,
  descr,
  media = {},
  tags = [],
  category,
  onChangeTitle,
  onChangeBody,
  onAddTag,
  onRemoveTag,
  onChangeImage,
  onChangeCategory,
}) => {
  const [tag, setTag] = useState();

  return (
    <Stack spacing={2}>
      {/* SETTINGS */}
      <Card>
        <CardHeader
          avatar={
            <Avatar aria-label="settings" sx={{ bgcolor: "white" }}>
              <SettingsIcon />
            </Avatar>
          }
          subheader="Settings"
        />
        <CardContent>
          <Stack spacing={2}>
            <Stack spacing={1} direction="row" flexWrap={"wrap"}>
              {tags.map((tag, index) => (
                <Chip key={"key-" + tag + index} label={tag} onDelete={() => onRemoveTag(tag)} />
              ))}
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                fullWidth
                value={tags.join(" ")}
                placeholder="Tags"
                value={tag}
                onChange={(e) => {
                  setTag(e.target.value.toLowerCase());
                }}
                onKeyDown={(e) => {
                  if (e.code === "Enter") {
                    onAddTag(tag);
                    setTag("");
                  }
                }}
              />
              <Fab
                sx={{ flexShrink: 0 }}
                size="small"
                disabled={!tag}
                onClick={() => {
                  onAddTag(tag);
                  setTag("");
                }}
              >
                <AddIcon />
              </Fab>
            </Stack>
            <SelectCategory fullWidth onChange={onChangeCategory} value={category} />
          </Stack>
        </CardContent>
      </Card>
      {/* POST */}
      <Collapse in={category}>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
                A
              </Avatar>
            }
            title={<TextField fullWidth label="Title" value={title} onChange={(e) => onChangeTitle(e.target.value)} />}
            // subheader="September 14, 2016"
          />
          <MediaEditable onChangeImage={onChangeImage} media={media} />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                multiline
                label="Description"
                value={descr}
                onChange={(e) => {
                  onChangeBody(e.target.value);
                }}
                size="small"
              />
              <AddText />
            </Stack>
          </CardContent>
        </Card>
      </Collapse>
    </Stack>
  );
};

export default PostEditable;
