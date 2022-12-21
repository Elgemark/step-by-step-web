import { Button, Card, CardActions, Chip, Collapse } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { red } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import MediaEditable from "../primitives/MediaEditable";
import { FC, useEffect, useState } from "react";
import SelectCategory from "../SelectCategory";
import SettingsIcon from "@mui/icons-material/Settings";
import AddText from "../primitives/AddText";
import TablePrerequisites from "../TablePrerequisites";
import _ from "lodash";
import styled from "styled-components";
import ListIcon from "@mui/icons-material/List";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { useStateObject } from "../../utils/object";
import { Media } from "../../utils/firebase/interface";
import { Lists } from "../../utils/firebase/type";
import { MouseEventHandler } from "react";
import ListEditable from "../lists/ListEditable";

const StyledMediaEditable = styled(MediaEditable)`
  img {
    object-fit: cover;
  }
`;

const PostEditable: FC<{
  title: string;
  descr: string;
  media: Media;
  tags: Array<string>;
  prerequisites: any;
  mediaLocationPath: Array<any>;
  category: string;
  lists: Lists;
  onAddList: any;
  onDeleteList: Function;
  onEditLists: Function;
}> = ({
  title,
  descr,
  media = {},
  tags = [],
  prerequisites = [],
  lists = [],
  mediaLocationPath = [],
  category,
  onAddList,
  onDeleteList,
  onEditLists,
  onChangeTitle,
  onChangeBody,
  onAddTag,
  onRemoveTag,
  onChangeImage,
  onChangeCategory,
  onChangePrerequisites,
}) => {
  const [tag, setTag] = useState("");
  const [prereqs, setPrereqs] = useState(prerequisites);

  useEffect(() => {
    onChangePrerequisites(prereqs);
  }, [prereqs]);

  const onAddPrerequisitesHandler = (item) => {
    const newPrereqs = [...prereqs];
    newPrereqs.push({ quantity: "", unit: "", ...item });
    setPrereqs(newPrereqs);
  };
  const onRemovePrerequisitesHandler = (index) => {
    const newPrereqs = [...prereqs];
    _.pullAt(newPrereqs, index);
    setPrereqs(newPrereqs);
  };

  const onEditPrerequisitesHandler = ({ index, key, value }) => {
    const newPrereqs = [...prereqs];
    _.set(newPrereqs, `[${index}].${key}`, value);
    setPrereqs(newPrereqs);
  };

  console.log("lists", lists);

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
          title="Settings"
          subheader="Choose category and add at least one tag. You can add upp to 5 tags."
        />
        <CardContent>
          <Stack spacing={2}>
            <SelectCategory fullWidth onChange={onChangeCategory} value={category} />
            <Stack spacing={1} direction="row" flexWrap={"wrap"}>
              {tags.map((tag, index) => (
                <Chip key={"key-" + tag + index} label={tag} onDelete={() => onRemoveTag(tag)} />
              ))}
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                size="small"
                fullWidth
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
          </Stack>
        </CardContent>
      </Card>
      {/* POST */}
      <Collapse in={category && tags.length > 0}>
        <Card>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
                A
              </Avatar>
            }
            title={<TextField fullWidth label="Title" value={title} onChange={(e) => onChangeTitle(e.target.value)} />}
          />
          <StyledMediaEditable onChangeImage={onChangeImage} media={media} locationPath={mediaLocationPath} />
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
              {lists.map((list) => (
                <ListEditable
                  onEdit={onEditLists}
                  onDelete={onDeleteList}
                  key={list.id}
                  id={list.id}
                  title={list.title}
                  items={list.items}
                />
              ))}
            </Stack>
          </CardContent>
          <CardActions>
            <Button onClick={onAddList} endIcon={<PlaylistAddIcon></PlaylistAddIcon>}>
              Add List
            </Button>
          </CardActions>
        </Card>
      </Collapse>
    </Stack>
  );
};

export default PostEditable;
