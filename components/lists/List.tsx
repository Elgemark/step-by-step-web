import { Accordion, AccordionDetails, AccordionSummary, IconButton, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import PushPinIcon from "@mui/icons-material/PushPin";
import Portal from "../primitives/Portal";
import { alpha } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ListItem } from "../../utils/firebase/api/list";
import { red } from "@mui/material/colors";
import ListTableItem from "../primitives/ListTableItem";
import ListTable from "../primitives/ListTable";

const StyledAccordion = styled(Accordion)`
  position: relative;
  top: ${({ pin }) => (pin ? "0" : "auto")};
  left: ${({ pin }) => (pin ? "0" : "auto")};
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

const List: FC<{
  title: string;
  items: Array<ListItem>;
}> = ({ title, items = [], ...rest }) => {
  const theme = useTheme();
  const [pin, setPin] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [doc, setDoc] = useState(null);

  const foundItemWithBadge = items.find((item) => item.badgeContent);

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
            <PushPinIcon sx={{ color: foundItemWithBadge ? red[500] : "white" }} fontSize="small" />
          </IconButton>

          <Typography variant="h6">{title}</Typography>
        </AccordionSummary>

        <AccordionDetails>
          <ListTable>
            {items.map((item: ListItem) => (
              <ListTableItem
                consumed={item.consumed}
                highlight={item.highlight}
                text={item.text}
                value={item.value}
                badgeContent={item.badgeContent}
              />
            ))}
          </ListTable>
        </AccordionDetails>
      </StyledAccordion>
    </Portal>
  );
};

export default List;
