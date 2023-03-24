import styled from "styled-components";
import SvgIcon from "@mui/material/SvgIcon";
import { InputLabel } from "@mui/material";
import { FC } from "react";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  border-left: 1px solid ${({ borderColor }) => borderColor};
  border-bottom: 1px solid ${({ borderColor }) => borderColor};
  border-right: 1px solid ${({ borderColor }) => borderColor};
  border-radius: 5px;
  margin: 1em;

  .header {
    display: flex;
    flex-direction: row;
    width: 100% !important;
  }
  .headerBorderBefore {
    border-top: 1px solid ${({ borderColor }) => borderColor};
    width: 0.6em;
    border-top-left-radius: 5px;
  }
  .headerBorderAfter {
    border-top: 1px solid ${({ borderColor }) => borderColor};
    width: 1em;
    flex-grow: 1;
    border-top-right-radius: 5px;
  }

  .title-container {
    margin: -1em 0.5em 0em 0.5em;
  }

  .title {
    transform: scale(0.75) translate(0, 0.6em);
  }

  .childrenContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -0.2em;
  }
`;

const BorderBox: FC<{ icon?: any; label?: string; children?: ReactJSXElement; [key: string]: any }> = ({
  icon,
  label,
  children,
  ...rest
}) => {
  const borderColor = "rgba(255,255,255,0.25)";
  return (
    <Root borderColor={borderColor} {...rest}>
      <div className="header">
        <div className="headerBorderBefore"></div>
        {(icon || label) && (
          <div className="title-container">
            {icon && <SvgIcon component={icon} />}
            {label && <InputLabel className="title">{label}</InputLabel>}
          </div>
        )}
        <div className="headerBorderAfter"></div>
      </div>
      <div className="childrenContainer">{children}</div>
    </Root>
  );
};

export default BorderBox;
