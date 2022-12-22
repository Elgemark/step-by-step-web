import { Divider, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { FC } from "react";
import { ListItem } from "../../utils/firebase/interface";

const StyledPaper = styled(Paper)`
  padding: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const StyledTable = styled.table`
  table-layout: fixed;
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  h6 {
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
  h6,
  p {
    opacity: 0.7;
  }
  .column-1 {
    text-align: left;
  }
  .column-2 {
    text-align: right;
  }
  td {
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }
`;

const List: FC<{
  id: string;
  title: string;
  items: Array<ListItem>;
}> = ({ id, title, items = [] }) => {
  const theme = useTheme();

  return (
    <StyledPaper elevation={3} theme={theme}>
      <StyledTable theme={theme}>
        <thead>
          <tr>
            <th className="column-1" colSpan={2}>
              <Typography variant="h6">{title}</Typography>
            </th>
            <th className="column-2"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item: ListItem, index) => (
            <tr key={`${id}-${index}`}>
              {/* TEXT Left */}
              <td className="column-1">
                <Typography variant="body2">{item.text}</Typography>
              </td>
              {/* TEXT Right */}
              <td className="column-2">
                <Typography variant="body2">{item.value}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledPaper>
  );
};

export default List;
