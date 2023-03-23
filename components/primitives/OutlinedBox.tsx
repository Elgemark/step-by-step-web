import styled from "styled-components";
import SvgIcon from "@mui/material/SvgIcon";
import { InputLabel } from "@mui/material";

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
    width: 1em;
    border-top-left-radius: 5px;
  }
  .headerTitle {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.25em;
    width: fit-content;
    margin: -1em 0.5em 0em 0.5em;
    text-overflow: ellipsis;
    font-size: 1em;
    font-weight: 600;
  }

  .title {
    transform: scale(0.75) translate(0, 0.6em);
  }

  .headerBorderAfter {
    border-top: 1px solid ${({ borderColor }) => borderColor};
    width: 1em;
    flex-grow: 2;
    border-top-right-radius: 5px;
  }

  .childrenContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: -0.2em;
  }
`;

const OutlinedBox = ({ icon, title, children }) => {
  const borderColor = "rgba(255,255,255,0.25)";
  return (
    <Root borderColor={borderColor}>
      <div className="header">
        <div className="headerBorderBefore"></div>
        {(icon || title) && (
          <div className="headerTitle">
            {icon && <SvgIcon component={icon} />}
            {title && <InputLabel className="title">{title}</InputLabel>}
          </div>
        )}
        <div className="headerBorderAfter"></div>
      </div>
      <div className="childrenContainer">{children}</div>
    </Root>
  );
};

export default OutlinedBox;
