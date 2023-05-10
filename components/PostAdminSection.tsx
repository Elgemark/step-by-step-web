"use client";

import { Button, useTheme } from "@mui/material";
import Card from "./primitives/Card";
import { FC } from "react";
import { Post } from "../utils/firebase/interface";
import { Steps } from "../utils/firebase/type";
import { useCollection } from "../utils/firebase/hooks/collections";
import { downloadObjectAsJson } from "../utils/stringUtils";
import styled from "styled-components";
import OpenDialog from "./primitives/OpenDialog";
import { readJSON } from "../utils/fileUtils";

const Root = styled(Card)`
  margin: ${({ theme }) => `${theme.spacing(1)} 0`};
`;

const PostAdminSection: FC<{ post: Post; steps: Steps; onOpen: (data: any) => void }> = ({ post, steps, onOpen }) => {
  const { data: lists, updateItem: updateList, deleteItem: deleteList } = useCollection(["posts", post.id, "lists"]);
  const theme = useTheme();

  const onSaveHandler = () => {
    downloadObjectAsJson({ post, steps, lists }, `${post.title}`);
  };

  const onFileSelectedHandler = async (e) => {
    const json = await readJSON(e.file);
    onOpen(json);
  };

  return (
    <Root theme={theme}>
      <Button onClick={onSaveHandler}>Save</Button>
      <OpenDialog accept="text/json" onFileSelected={onFileSelectedHandler}>
        <Button>Open</Button>
      </OpenDialog>
    </Root>
  );
};

export default PostAdminSection;
