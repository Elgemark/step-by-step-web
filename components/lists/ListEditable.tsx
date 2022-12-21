import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { Button, Fade, Input, useTheme } from "@mui/material";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { FC, useEffect } from "react";
import { ListItem } from "../../utils/firebase/interface";
import { useStateObject } from "../../utils/object";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledTable = styled.table`
  table-layout: fixed;
  text-align: left;
  width: 100%;
  h6,
  p {
    opacity: 0.7;
  }
  .column-1 {
    width: 60%;
    text-align: left;
  }
  .column-2 {
    text-align: right;
  }
  .column-2 {
    text-align: right;
  }
  thead th {
    /* border-bottom: 1px solid white; */
  }
  thead .column-3 {
    display: ${({ editable }) => (editable ? "" : "none")};
  }
`;

const RemoveButton = ({ onClick }) => {
  return (
    <IconButton edge="end" aria-label="remove" onClick={onClick}>
      <RemoveIcon />
    </IconButton>
  );
};

const ListEditable: FC<{
  id: string;
  title: string;
  items: Array<ListItem>;
  onEdit: Function | undefined;
  onRemoveListItem: Function | undefined;
  onDelete: Function | undefined;
}> = ({ id, title, items = [], onDelete, onRemoveListItem, onEdit }) => {
  const { object, setValue, getValue } = useStateObject({ title, items, id });
  const theme = useTheme();

  const updateValue = (path, value) => {
    const result: object = setValue(path, value);
    onEdit(result);
  };

  return (
    <StyledPaper elevation={3} theme={theme}>
      <StyledTable theme={theme}>
        <thead>
          <tr>
            <th className="column-1" colSpan={1}>
              <Input value={object.title} onChange={(e) => updateValue("title", e.target.value)} />
            </th>
            <th className="column-2"></th>
            <th className="column-3"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: ListItem, index) => (
            <Fade in={true} key={index}>
              <tr key={`${item.text}-${index}`}>
                {/* TEXT Left */}
                <th className="column-1">
                  <Input
                    value={getValue("items." + index + ".text")}
                    onChange={(e) => updateValue("items." + index + ".text", e.target.value)}
                  />
                </th>
                {/* TEXT Right */}
                <td className="column-2">
                  <Input
                    value={"items." + index + ".value"}
                    onChange={(e) => updateValue("items." + index + ".value", e.target.value)}
                  />
                </td>
                {/* REMOVE BUTTON */}
                <td className="column-3">
                  <RemoveButton onClick={() => onRemoveListItem(index)} />
                </td>
              </tr>
              <tr>
                <th colSpan={3}>
                  <Button>Add list item</Button>
                </th>
              </tr>
            </Fade>
          ))}
        </tbody>
        <Button>Delete List</Button>
      </StyledTable>
    </StyledPaper>
  );
};

export default ListEditable;
