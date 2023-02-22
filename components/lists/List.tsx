import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import Portal from "../primitives/Portal";
import { alpha } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ListItem } from "../../utils/firebase/api/list";

const StyledAccordion = styled(Accordion)`
  position: ${({ pin }) => (pin ? "sticky" : "relative")};
  top: ${({ pin }) => (pin ? "70px" : "auto")};
  background-color: ${({ theme, pin }) =>
    pin ? alpha(theme.palette.background.paper, 0.8) : theme.palette.background.paper};
  /* margin-bottom: ${({ pin }) => (pin ? "1rem" : 0)}; */

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

const StyledTR = styled.tr`
  p {
    text-decoration: ${({ consumed }) => (consumed ? "line-through" : "none")};
    opacity: ${({ highlight }) => (highlight ? 1 : 0.7)};
  }

  .highlight::before {
    content: "👉  ";
    animation: ${({ highlight }) => (highlight ? "pulse 2s infinite" : "none")};
  }

  @keyframes pulse {
    0% {
      opacity: 100%;
    }
    50% {
      opacity: 50%;
    }
    100% {
      opacity: 100%;
    }
  }
`;

const List: FC<{
  title: string;
  items: Array<ListItem>;
}> = ({ title, items = [], ...rest }) => {
  const theme = useTheme();
  const [pin, setPin] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [doc, setDoc] = useState(null);

  useEffect(() => {
    setDoc(document);
  }, []);

  const onClickPinHandler = () => {
    setPin(!pin);
  };

  if (!doc) {
    return null;
  }

  return (
    <Portal show={pin} target={doc.getElementById("pinned-lists")}>
      <StyledAccordion
        disableGutters
        expanded={!collapse}
        onChange={() => setCollapse(!collapse)}
        elevation={3}
        theme={theme}
        pin={pin}
        className="list"
        {...rest}
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
                <StyledTR key={`${item.id}-${index}`} {...item}>
                  {/* TEXT Left */}
                  <td className="column-1">
                    <Typography variant="body2" className={item.highlight ? "highlight" : ""}>
                      {item.text}
                    </Typography>
                  </td>
                  {/* TEXT Right */}
                  <td className="column-2">
                    <Typography variant="body2">{item.value}</Typography>
                  </td>
                </StyledTR>
              ))}
            </tbody>
          </StyledTable>
        </AccordionDetails>
      </StyledAccordion>
    </Portal>
  );
};

export default List;
