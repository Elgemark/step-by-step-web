import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { Fade, Input, useTheme } from "@mui/material";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { FC } from "react";
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
    border-bottom: 1px solid white;
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
  title: string;
  items: Array<ListItem>;
  onRemove: Function | undefined;
  onEdit: Function | undefined;
  editable: Boolean;
}> = ({ title, items = [], onRemove, onEdit, editable = false }) => {
  const { object, setValue, getValue } = useStateObject({ title, items });
  const theme = useTheme();

  return (
    <StyledPaper elevation={3} theme={theme}>
      <StyledTable editable={editable} theme={theme}>
        <thead>
          <tr>
            <th className="column-1" colSpan={editable ? 1 : 3}>
              <Input value={object.title} onChange={(e) => setValue("title", e.target.value)} />
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
                    onChange={(e) => setValue("items." + index + ".text", e.target.value)}
                  />
                </th>
                {/* TEXT Right */}
                <td className="column-2">
                  <Input
                    value={"items." + index + ".value"}
                    onChange={(e) => setValue("items." + index + ".value", e.target.value)}
                  />
                </td>
                {/* REMOVE BUTTON */}
                <td className="column-3">
                  <RemoveButton onClick={() => onRemove(index)} />
                </td>
              </tr>
            </Fade>
            // ADD LISTE ITEM BUTTON
          ))}
        </tbody>
      </StyledTable>
    </StyledPaper>
  );
};

export default ListEditable;
