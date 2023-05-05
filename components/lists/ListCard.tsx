import { Card, CardContent, useTheme } from "@mui/material";
import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import { ListItems, Lists } from "../../utils/firebase/api/list";
import { backgroundBlurMixin } from "../../utils/styleUtils";
import { useCollection } from "../../utils/firebase/hooks/collections";
import { Progress } from "../../utils/firebase/api/progress";
import _ from "lodash";
import List from "./List";

const Root = styled(Card)`
  /* ${backgroundBlurMixin} */
  background-color: transparent;
  margin-top: ${({ theme }) => theme.spacing(1)};
  position: ${({ sticky }) => (sticky ? "sticky" : "relative")};
  top: ${({ sticky }) => (sticky ? "70px" : "auto")};
  z-index: 999;
  .MuiCardContent-root {
    padding: 0px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const ListController: FC<{ postId: string; listId: string; listTitle: string; progress: Progress }> = ({
  postId,
  listId,
  listTitle,
  progress,
}) => {
  const { data: listItems } = useCollection(["posts", postId, "lists", listId, "items"]);
  const calculatedListItems = listItems.map((item) => {
    const currentStep = _.last(progress.stepsCompleted);
    const previousSteps = _.slice(progress.stepsCompleted, 0, progress.stepsCompleted.length - 1);
    return {
      ...item,
      highlight: item.stepId && item.stepId === currentStep,
      consumed: previousSteps.includes(item.stepId),
      badgeContent: (item.stepId && item.stepId === currentStep && progress.stepsCompleted.length) || null,
    };
  });

  return (
    <List collapsed={progress.stepsCompleted.length != 0} title={listTitle} items={calculatedListItems as ListItems} />
  );
};

const ListCard: FC<{
  postId: string;
  lists?: Lists;
  progress?: Progress;
}> = ({ lists = [], progress, postId }) => {
  const [doc, setDoc] = useState(null);
  const theme = useTheme();
  const started = progress.stepsCompleted.length > 0;

  useEffect(() => {
    setDoc(document);
  }, []);

  if (!doc) {
    return null;
  }

  return (
    <Root theme={theme} sticky={started}>
      {lists.length && progress ? (
        <CardContent>
          {lists.map((list) => (
            <ListController postId={postId} listId={list.id} listTitle={list.title} progress={progress as Progress} />
          ))}
        </CardContent>
      ) : null}
    </Root>
  );
};

export default ListCard;
