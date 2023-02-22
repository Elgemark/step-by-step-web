import { useTheme } from "@mui/material";
import styled from "styled-components";

const StyledTable = styled.table`
  table-layout: fixed;
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  .column-1 {
    text-align: left;
    display: flex;
  }
  .column-2 {
    text-align: right;
  }
  td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }
`;

const ListTable = ({ children }) => {
  const theme = useTheme();
  return (
    <StyledTable theme={theme}>
      <tbody>{children}</tbody>
    </StyledTable>
  );
};

export default ListTable;
