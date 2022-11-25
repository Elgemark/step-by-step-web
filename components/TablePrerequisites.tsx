import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { Box, Fade, Grid, Input, Stack, TextField, Typography } from "@mui/material";
import styled from "styled-components";

interface Item {
  text: string;
  quantity: string;
  unit: string;
}

const StyledTable = styled.table`
  text-align: left;
  th,
  td {
    padding: 0 5px;
  }
  tr {
  }
  thead th {
    border-bottom: 1px solid white;
  }
  .column-1 {
    width: 60%;
  }
  .column-4 {
    display: ${(editable) => (editable ? "inherit" : "none")};
  }
`;

const RemoveButton = ({ onClick }) => {
  return (
    <IconButton edge="end" aria-label="remove" onClick={onClick}>
      <RemoveIcon />
    </IconButton>
  );
};

const TablePrerequisites = ({ items = [], onRemove, editable = false }) => {
  if (items.length === 0) {
    return <></>;
  }

  return (
    <StyledTable>
      <thead>
        <tr>
          <th className="column-1">
            <Typography variant="h6">{"Prerequisites"}</Typography>
          </th>
          <th className="column-2">
            <Typography>{"quantity"}</Typography>
          </th>
          <th className="column-3">
            <Typography>{"unit"}</Typography>
          </th>
          <th className="column-4" editable></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item: Item, index) => (
          <tr key={index}>
            {/* TEXT */}
            <th className="column-1">
              <Typography>{item.text}</Typography>
            </th>
            {/* QUANTITY */}
            <td className="column-2">
              <Input placeholder="quantity" value={item.quantity} />
            </td>
            {/* UNIT */}
            <td className="column-3">
              <Input placeholder="unit" value={item.unit} />
            </td>
            {/* REMOVE BUTTON */}
            <td editable className="column-4">
              <RemoveButton />
            </td>
          </tr>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default TablePrerequisites;
