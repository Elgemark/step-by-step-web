import { Button, Card, CardActions, Chip, Collapse } from "@mui/material";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import ImageEditable from "../primitives/ImageEditable";
import { FC, useState } from "react";
import SelectCategory from "../SelectCategory";
import SettingsIcon from "@mui/icons-material/Settings";
import _ from "lodash";
import styled from "styled-components";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import { Lists } from "../../utils/firebase/type";
import { List, Post } from "../../utils/firebase/interface";
import ListEditable from "../lists/ListEditable";
import { useStateObject } from "../../utils/object";
import { toSanitizedArray } from "../../utils/stringUtils";
import UserAvatar from "../UserAvatar";

const Root = styled(Stack)`
  .card-actions {
    justify-content: center;
  }
`;

const StyledImageEditable = styled(ImageEditable)`
  img {
    object-fit: cover;
  }
`;

const PostEditable: FC<{
  post: Post;
  lists: Lists;
  onChangeList: (list: List) => void;
  onDeleteList: (id: string) => void;
  onAddList: Function;
  onChange: Function;
}> = ({ post, lists = [], onChangeList, onDeleteList, onAddList, onChange }) => {
  const [tag, setTag] = useState("");
  const { object: data, setValue: setData } = useStateObject(post);

  const updateData = (path, value) => {
    const updatedData = setData(path, value);
    onChange(updatedData);
  };

  const addTag = (value) => {
    const tags = toSanitizedArray(value, _.get(data, "tags"));
    updateData("tags", tags);
  };

  const removeTag = (value) => {
    const tags = _.get(data, "tags", []);
    _.remove(tags, (tag) => tag === value);
    updateData("tags", tags);
  };

  return (
    <Root spacing={2}>
      {/* SETTINGS */}
      <Card>
        <CardHeader
          avatar={<SettingsIcon fontSize="large" />}
          title="Settings"
          subheader="Choose category and add at least one tag. You can add upp to 5 tags."
        />
        <CardContent>
          <Stack spacing={2}>
            <SelectCategory
              fullWidth
              onChange={(value) => {
                updateData("category", value);
              }}
              value={data.category || ""}
            />
            <Stack spacing={1} direction="row" flexWrap={"wrap"}>
              {data.tags.map((tag, index) => (
                <Chip key={"key-" + tag + index} label={tag} onDelete={() => removeTag(tag)} />
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
                    addTag(tag);
                    setTag("");
                  }
                }}
              />
              <Fab
                sx={{ flexShrink: 0 }}
                size="small"
                disabled={!tag}
                onClick={() => {
                  addTag(tag);
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
      <Collapse in={data.category && data.tags.length > 0}>
        <Card>
          <CardHeader
            avatar={<UserAvatar size={48} />}
            title={
              <TextField
                fullWidth
                label="Title"
                value={data.title}
                onChange={(e) => updateData("title", e.target.value)}
              />
            }
          />
          <StyledImageEditable
            onBlobChange={(blob) => {
              updateData("blob", blob);
            }}
            media={data.media}
          />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                multiline
                label="Description"
                value={data.descr}
                onChange={(e) => updateData("descr", e.target.value)}
                size="small"
              />
              {lists.map((list) => (
                <ListEditable onChange={onChangeList} onDelete={onDeleteList} key={list.id} list={list} />
              ))}
            </Stack>
          </CardContent>
          <CardActions className="card-actions">
            <Button onClick={() => onAddList()} endIcon={<PlaylistAddIcon></PlaylistAddIcon>}>
              Add List
            </Button>
          </CardActions>
        </Card>
      </Collapse>
    </Root>
  );
};

export default PostEditable;
