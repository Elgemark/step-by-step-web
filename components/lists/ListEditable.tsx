import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import { Fade, Input, useTheme } from "@mui/material";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { FC } from "react";
import { ListItem } from "../../utils/firebase/interface";
import { useStateObject } from "../../utils/object";
import DeleteIcon from "@mui/icons-material/Delete";

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
  id: string;
  title: string;
  items: Array<ListItem>;
  onEdit: (e: object) => {} | Function;
  onDelete: (e: object) => {} | Function;
}> = ({ id, title, items = [], onDelete, onEdit }) => {
  const { object, setValue, getValue } = useStateObject({ title, items, id });
  const theme = useTheme();

  const updateValue = (path, value) => {
    const result: object = setValue(path, value);
    onEdit(result);
  };

  const onAddListItemHandler = ({ index }) => {
    const newItems = [...object.items];
    newItems.splice(index + 1, 0, { text: "", value: "" });
    updateValue("items", newItems);
  };

  const onDeleteListItemHandler = ({ index }) => {
    const newItems = [...object.items];
    newItems.splice(index, 1);
    updateValue("items", newItems);
  };

  return (
    <StyledPaper elevation={3} theme={theme}>
      <StyledTable theme={theme}>
        <thead>
          <tr>
            <th className="column-1" colSpan={1}>
              <Input value={object.title} placeholder="Title" onChange={(e) => updateValue("title", e.target.value)} />
            </th>
            <th className="column-2"></th>
            <th className="column-3"></th>
          </tr>
        </thead>
        <tbody>
          {object.items.map((item: ListItem, index) => (
            <Fade in={true} key={`${id}-${index}`}>
              <tr>
                {/* TEXT Left */}
                <th className="column-1">
                  <Input
                    placeholder="Text left..."
                    value={item.text}
                    onChange={(e) => updateValue("items." + index + ".text", e.target.value)}
                  />
                </th>
                {/* TEXT Right */}
                <td className="column-2">
                  <Input
                    placeholder="Text right..."
                    value={item.value}
                    onChange={(e) => updateValue("items." + index + ".value", e.target.value)}
                  />
                </td>
                {/* REMOVE BUTTON */}
                <td className="column-3">
                  <RemoveButton onClick={() => onDeleteListItemHandler({ id, index })} />
                </td>
                {/* ADD BUTTON */}
                <td className="column-4">
                  <AddButton onClick={() => onAddListItemHandler({ id, index })} />
                </td>
              </tr>
            </Fade>
          ))}
          <tr className="list-buttons">
            <td colSpan={3}>
              <IconButton edge="end" aria-label="remove" onClick={() => onDelete({ id })}>
                <DeleteIcon />
              </IconButton>
            </td>
          </tr>
        </tbody>
      </StyledTable>
    </StyledPaper>
  );
};

export default ListEditable;
