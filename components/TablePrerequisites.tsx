import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { Fade, Input, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import PropTypes from "prop-types";
import Paper from "@mui/material/Paper";

interface Item {
  text: string;
  quantity: string;
  unit: string;
}

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(2)};
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
  }
  .column-2 {
    text-align: ${({ editable }) => (editable ? "left" : "right")};
  }
  .column-3 {
    text-align: ${({ editable }) => (editable ? "left" : "right")};
  }
  thead th {
    border-bottom: 1px solid white;
  }
  thead .column-2 {
    display: ${({ editable }) => (editable ? "" : "none")};
  }
  thead .column-3 {
    display: ${({ editable }) => (editable ? "" : "none")};
  }
  thead .column-4 {
    display: ${({ editable }) => (editable ? "none" : "none")};
  }

  tbody .column-4 {
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

const TablePrerequisites = (props) => {
  if (props.editable) {
    return <TablePrerequisitesEditable {...props} />;
  } else {
    return <TablePrerequisitesDefault {...props} />;
  }
};

const TablePrerequisitesDefault = ({ items = [], editable = false }) => {
  const theme = useTheme();
  if (items.length === 0) {
    return <></>;
  }

  return (
    <StyledPaper elevation={4} theme={theme}>
      <StyledTable editable={editable} theme={theme}>
        <thead>
          <tr>
            <th className="column-1" colSpan={2}>
              <Typography variant="subtitle1">{"Prerequisites"}</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: Item, index) => (
            <Fade in={true}>
              <tr key={index}>
                {/* TEXT */}
                <th className="column-1">
                  <Typography variant="body2">{item.text}</Typography>
                </th>
                {/* QUANTITY & UNIT */}
                <td className="column-2">
                  <Typography variant="body2">{`${item.quantity} ${item.unit}`}</Typography>
                </td>
              </tr>
            </Fade>
          ))}
        </tbody>
      </StyledTable>
    </StyledPaper>
  );
};

const TablePrerequisitesEditable = ({ items = [], onRemove, onEdit, editable = false }) => {
  const theme = useTheme();
  if (items.length === 0) {
    return <></>;
  }

  return (
    <StyledPaper elevation={3} theme={theme}>
      <StyledTable editable={editable} theme={theme}>
        <thead>
          <tr>
            <th className="column-1" colSpan={editable ? 1 : 3}>
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
                  <Input value={item.text} onChange={(e) => onEdit({ index, key: "text", value: e.target.value })} />
                </th>
                {/* QUANTITY */}
                <td className="column-2">
                  <Input
                    value={item.quantity}
                    onChange={(e) => onEdit({ index, key: "quantity", value: e.target.value })}
                  />
                </td>
                {/* UNIT */}
                <td className="column-3">
                  <Input value={item.unit} onChange={(e) => onEdit({ index, key: "unit", value: e.target.value })} />
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
    </StyledPaper>
  );
};

const componentPropTypes = {
  items: PropTypes.array,
  onRemove: PropTypes.oneOf([PropTypes.func, undefined]),
  onEdit: PropTypes.oneOf([PropTypes.func, undefined]),
  editable: PropTypes.bool,
};

TablePrerequisites.propTypes = componentPropTypes;
TablePrerequisitesDefault.propTypes = componentPropTypes;
TablePrerequisitesEditable.propTypes = componentPropTypes;

export default TablePrerequisites;
