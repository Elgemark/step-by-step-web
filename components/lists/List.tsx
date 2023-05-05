import { Accordion, AccordionDetails, AccordionSummary, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import { FC, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ListItem } from "../../utils/firebase/api/list";
import ListTableItem from "../primitives/ListTableItem";
import ListTable from "../primitives/ListTable";
import ListIcon from "@mui/icons-material/List";
import { backgroundBlurMixin } from "../../utils/styleUtils";

const StyledAccordion = styled(Accordion)`
  position: relative;
  ${backgroundBlurMixin}
  .MuiAccordionSummary-content .MuiSvgIcon-root {
    margin-right: ${({ theme }) => theme.spacing(1)};
  }
  h6,
  p {
    opacity: 0.7;
  }
`;

const List: FC<{
  title: string;
  items: Array<ListItem>;
  collapsed?: boolean;
}> = ({ title, items = [], collapsed = false, ...rest }) => {
  const theme = useTheme();
  const [collapse, setCollapse] = useState(collapsed);
  const [doc, setDoc] = useState(null);

  const foundItemWithBadge = items.find((item) => item.badgeContent);

  useEffect(() => {
    if (collapsed) {
      setCollapse(true);
    }
  }, [collapsed]);

  useEffect(() => {
    setDoc(document);
  }, []);

  if (!doc) {
    return null;
  }

  return (
    <StyledAccordion
      disableGutters
      expanded={!collapse}
      onChange={() => setCollapse(!collapse)}
      elevation={3}
      theme={theme}
      className="list"
      {...rest}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ListIcon sx={{ color: foundItemWithBadge ? "#FF5733" : "white" }} />
        <Typography variant="button">{title}</Typography>
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
  );
};

export default List;
