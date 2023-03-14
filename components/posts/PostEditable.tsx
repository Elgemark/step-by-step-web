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
import { Post } from "../../utils/firebase/interface";
import ListEditable from "../lists/ListEditable";
import { useStateObject } from "../../utils/object";
import { toSanitizedArray } from "../../utils/stringUtils";
import UserAvatar from "../UserAvatar";
import { addCollectionItem, useCollection } from "../../utils/firebase/hooks/collections";
import { v4 as uuid } from "uuid";
import { useMessages } from "../../hooks/message";

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
  onChange: (data: object) => void;
  onListChange: () => void;
}> = ({ post, onChange, onListChange }) => {
  const { data: lists, updateItem: updateList, deleteItem: deleteList } = useCollection(["posts", post.id, "lists"]);
  const [tag, setTag] = useState("");
  const { object: data, setValue: setData } = useStateObject(post);
  const { addMessage } = useMessages();

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

  const onAddListHandler = async () => {
    const listId = uuid();
    // Add new list
    addCollectionItem(["posts", post.id, "lists", listId], { id: listId, title: "" });
    // Add new listitems to list
    addCollectionItem(["posts", post.id, "lists", listId, "items", listId], {
      id: listId,
      text: "",
      value: "",
      index: 0,
    });
  };

  const onChangeListTitleHandler = (listId: string, title: string) => {
    //const list = lists.find((item) => item.id === listId);
    updateList(listId, { title });
    onListChange();
  };

  const onDeleteListHandler = (listId) => {
    deleteList(listId).then((e) => {
      // Show message...
      addMessage({ id: "alert", message: "list deleted" });
    });
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
            onDelete={() => {
              const updatedData = updateData("media.imageURI", null);
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
                <ListEditable
                  postId={post.id}
                  onChangeTitle={(title) => onChangeListTitleHandler(list.id, title)}
                  onDeleteList={onDeleteListHandler}
                  onChange={onListChange}
                  key={list.id}
                  list={list}
                />
              ))}
            </Stack>
          </CardContent>
          <CardActions className="card-actions">
            <Button onClick={onAddListHandler} endIcon={<PlaylistAddIcon></PlaylistAddIcon>}>
              Add List
            </Button>
          </CardActions>
        </Card>
      </Collapse>
    </Root>
  );
};

export default PostEditable;
