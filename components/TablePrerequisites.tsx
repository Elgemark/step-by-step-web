import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { Fade, Input, Typography } from "@mui/material";
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
    display: ${({ editable }) => (editable ? "inherit" : "none")};
  }
`;

const RemoveButton = ({ onClick }) => {
  return (
    <IconButton edge="end" aria-label="remove" onClick={onClick}>
      <RemoveIcon />
    </IconButton>
  );
};

const TablePrerequisites = ({ items = [], onRemove, onEdit, editable = false }) => {
  if (items.length === 0) {
    return <></>;
  }

  return (
    <StyledTable editable={editable}>
      <thead>
        <tr>
          <th className="column-1">
            <Typography variant="h6">{"Prerequisites"}</Typography>
          </th>
          <th className="column-2">
            <Typography>{"Quantity"}</Typography>
          </th>
          <th className="column-3">
            <Typography>{"Unit"}</Typography>
          </th>
          <th className="column-4"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item: Item, index) => (
          <Fade in={true}>
            <tr key={index}>
              {/* TEXT */}
              <th className="column-1">
                {editable ? (
                  <Input value={item.text} onChange={(e) => onEdit({ index, key: "text", value: e.target.value })} />
                ) : (
                  <Typography>{item.text}</Typography>
                )}
              </th>
              {/* QUANTITY */}
              <td className="column-2">
                {editable ? (
                  <Input
                    value={item.quantity}
                    onChange={(e) => onEdit({ index, key: "quantity", value: e.target.value })}
                  />
                ) : (
                  <Typography>{item.unit}</Typography>
                )}
              </td>
              {/* UNIT */}
              <td className="column-3">
                {editable ? (
                  <Input value={item.unit} onChange={(e) => onEdit({ index, key: "unit", value: e.target.value })} />
                ) : (
                  <Typography>{item.unit}</Typography>
                )}
              </td>
              {/* REMOVE BUTTON */}
              <td className="column-4">
                <RemoveButton onClick={() => onRemove(index)} />
              </td>
            </tr>
          </Fade>
        ))}
      </tbody>
    </StyledTable>
  );
};

export default TablePrerequisites;
