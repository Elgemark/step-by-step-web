import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { Fade, Input, useTheme } from "@mui/material";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { FC, MutableRefObject, ReactPropTypes } from "react";
import { List, ListItem } from "../../utils/firebase/api/list";
import DeleteIcon from "@mui/icons-material/Delete";
import { useListItems } from "../../utils/firebase/api/list";
import { v4 as uuid } from "uuid";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { createRoot } from "react-dom/client";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
`;

const StyledTable = styled.table`
  table-layout: fixed;
  text-align: left;
  width: 100%;
  h6,
  p {
    opacity: 0.7;
  }
  tr {
    display: block;
  }
  .column-1,
  .column-1 input {
    text-align: left;
  }
  .column-2,
  .column-2 input {
    text-align: right;
  }
  thead th {
    /* border-bottom: 1px solid white; */
  }
  thead .column-3 {
    display: ${({ editable }) => (editable ? "" : "none")};
  }

  .list-buttons {
    margin-top: ${({ theme }) => theme.spacing(2)};
    display: flex;
    justify-content: flex-end;
  }
`;

const RemoveButton = ({ onClick }) => {
  return (
    <IconButton edge="end" aria-label="remove" onClick={onClick}>
      <RemoveIcon />
    </IconButton>
  );
};

const AddButton = ({ onClick }) => {
  return (
    <IconButton edge="end" aria-label="remove" onClick={onClick}>
      <AddIcon />
    </IconButton>
  );
};

const ListEditable: FC<{
  postId: string;
  list: List;
  onChangeTitile: (title: string) => void;
  [key: string]: any;
}> = forwardRef(({ postId, list, onChangeTitile }, ref) => {
  const theme = useTheme();
  const {
    data: listItems,
    deleteListItem,
    addListItem,
    updateListItem,
    save: saveList,
  } = useListItems(postId, list.id);

  useImperativeHandle(ref, () => ({
    save() {
      saveList();
    },
  }));

  const updateListItemHandler = async (itemId: string, key: string, value: any) => {
    await updateListItem(itemId, { [key]: value });
  };

  const onAddListItemHandler = (index) => {
    addListItem({ id: uuid(), text: "", value: "" }, index);
  };

  const onDeleteListItemHandler = async (itemId) => {
    await deleteListItem(itemId);
  };

  return (
    <StyledPaper elevation={3} theme={theme}>
      <StyledTable theme={theme}>
        <thead>
          <tr>
            <th className="column-1" colSpan={1}>
              <Input value={list.title} placeholder="Title" onChange={(e) => onChangeTitile(e.target.value)} />
            </th>
            <th className="column-2"></th>
            <th className="column-3"></th>
          </tr>
        </thead>
        <tbody>
          {listItems &&
            listItems.map((item: ListItem, index) => (
              <Fade in={true} key={`${list.id}-${index}`}>
                <tr>
                  {/* TEXT Left */}
                  <th className="column-1">
                    <Input
                      placeholder="Text left..."
                      value={item.text}
                      onChange={(e) => updateListItemHandler(item.id, "text", e.target.value)}
                    />
                  </th>
                  {/* TEXT Right */}
                  <td className="column-2">
                    <Input
                      placeholder="Text right..."
                      value={item.value}
                      onChange={(e) => updateListItemHandler(item.id, "value", e.target.value)}
                    />
                  </td>
                  {/* REMOVE BUTTON */}
                  <td className="column-3">
                    <RemoveButton onClick={() => onDeleteListItemHandler(item.id)} />
                  </td>
                  {/* ADD BUTTON */}
                  <td className="column-4">
                    <AddButton onClick={() => onAddListItemHandler(index)} />
                  </td>
                </tr>
              </Fade>
            ))}
          <tr className="list-buttons">
            <td colSpan={3}>
              <IconButton edge="end" aria-label="remove" onClick={() => onDelete(list.id)}>
                <DeleteIcon />
              </IconButton>
            </td>
          </tr>
        </tbody>
      </StyledTable>
    </StyledPaper>
  );
});

export default ListEditable;
