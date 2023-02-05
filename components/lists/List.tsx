import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import Paper from "@mui/material/Paper";
import { FC, useState } from "react";
import { ListItem } from "../../utils/firebase/interface";
import PushPinIcon from "@mui/icons-material/PushPin";
import Portal from "../primitives/Portal";
import { alpha } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledAccordion = styled(Accordion)`
  position: ${({ pin }) => (pin ? "sticky" : "relative")};
  top: ${({ pin }) => (pin ? "70px" : "auto")};
  background-color: ${({ theme, pin }) =>
    pin ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper};

  .button-pin {
    transform: rotate(-45deg);
    margin: 3px 5px 0 -5px;
  }
  h6,
  p {
    opacity: 0.7;
  }
`;

const StyledTable = styled.table`
  table-layout: fixed;
  text-align: left;
  width: 100%;
  border-collapse: collapse;
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
  const [pin, setPin] = useState(false);
  const [collapse, setCollapse] = useState(false);

  const onClickPinHandler = () => {
    setPin(!pin);
  };

  return (
    <Portal show={pin} target={document.getElementById("pinned-lists")}>
      <StyledAccordion
        disableGutters
        expanded={!collapse}
        onChange={() => setCollapse(!collapse)}
        elevation={3}
        theme={theme}
        pin={pin}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <IconButton
            size="small"
            className="button-pin"
            onClick={(e) => {
              onClickPinHandler();
              e.stopPropagation();
            }}
          >
            <PushPinIcon fontSize="small" />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <StyledTable theme={theme}>
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
        </AccordionDetails>
      </StyledAccordion>
    </Portal>
  );
};

export default List;
