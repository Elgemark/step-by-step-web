import { Collapse, IconButton, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { FC, useState } from "react";
import { ListItem } from "../../utils/firebase/interface";
import PushPinIcon from "@mui/icons-material/PushPin";
import Portal from "../primitives/Portal";
import { alpha } from "@mui/material";

const StyledPaper = styled(Paper)`
  position: ${({ pin }) => (pin ? "sticky" : "relative")};
  top: ${({ pin }) => (pin ? "70px" : "auto")};
  _background-color: ${({ theme }) => theme.palette.background.paper};
  background-color: ${({ theme, pin }) =>
    pin ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper};
  padding: ${({ theme }) => theme.spacing(1)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  .button-pin {
    position: absolute;
    right: 0;
    top: 0;
  }
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

  console.log(alpha(theme.palette.background.paper, 0.2));

  const [pin, setPin] = useState(false);
  const [collapse, setCollapse] = useState(false);

  const onClickPinHandler = () => {
    setPin(!pin);
  };

  const onHeaderClickHandler = () => {
    setCollapse(!collapse);
  };

  return (
    <Portal show={pin} target={document.getElementById("pinned-lists")}>
      <StyledPaper elevation={3} theme={theme} pin={pin}>
        <IconButton className="button-pin" onClick={onClickPinHandler}>
          <PushPinIcon />
        </IconButton>
        <StyledTable theme={theme}>
          <thead onClick={onHeaderClickHandler}>
            <tr>
              <th className="column-1" colSpan={2}>
                <Typography variant="h6">{title}</Typography>
              </th>
              <th className="column-2"></th>
            </tr>
          </thead>
          <Collapse in={!collapse}>
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
          </Collapse>
        </StyledTable>
      </StyledPaper>
    </Portal>
  );
};

export default List;
