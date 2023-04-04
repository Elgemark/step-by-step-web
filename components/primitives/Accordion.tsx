import { Accordion as MUIAccordion, AccordionDetails, AccordionSummary, Typography, useTheme } from "@mui/material";
import styled from "styled-components";
import { FC, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const Root = styled(MUIAccordion)`
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  position: relative;
  h6,
  p {
    opacity: 0.7;
  }
`;

const Accordion: FC<{ title?: string; summary?: ReactJSXElement; children: ReactJSXElement }> = ({
  title,
  summary,
  children,
  ...rest
}) => {
  const [collapse, setCollapse] = useState(true);
  const theme = useTheme();

  return (
    <Root
      disableGutters
      expanded={!collapse}
      onChange={() => setCollapse(!collapse)}
      elevation={3}
      theme={theme}
      {...rest}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        {summary}
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>

      <AccordionDetails>{children}</AccordionDetails>
    </Root>
  );
};

export default Accordion;
