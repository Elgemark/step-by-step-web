import { Typography } from "@mui/material";
import styled from "styled-components";
import { FC, ReactNode } from "react";
import { red } from "@mui/material/colors";

const StyledTR = styled.tr`
  p {
    text-decoration: ${({ consumed }) => (consumed ? "line-through" : "none")};
    opacity: ${({ highlight }) => (highlight ? 1 : 0.7)};
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

const CustomBadge = ({ badgeContent, ...rest }) => {
  return (
    <span className="badge" {...rest}>
      <Typography variant="subtitle2">{badgeContent}</Typography>
    </span>
  );
};

const StyledCustomBadge = styled(CustomBadge)`
  animation: pulse 2s infinite;
  background-color: ${() => red[500]};
  width: 18px;
  height: 18px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  margin-top: 1px;
  h6 {
    margin-top: 0px;
    color: black;
  }
`;

const ListTableItem: FC<{
  text: string;
  value: string;
  consumed?: boolean;
  highlight?: boolean;
  badgeContent?: ReactNode;
  className: string;
}> = ({ text, value, badgeContent = null, highlight = false, consumed = false, className }) => {
  return (
    <StyledTR consumed={consumed} className={className}>
      {/* TEXT Left */}
      <td className="column-1">
        {badgeContent ? <StyledCustomBadge badgeContent={badgeContent}></StyledCustomBadge> : null}
        <Typography variant="body2" className={highlight ? "highlight" : ""}>
          {text}
        </Typography>
      </td>

      {/* TEXT Right */}
      <td className="column-2">
        <Typography variant="body2">{value}</Typography>
      </td>
    </StyledTR>
  );
};

export default ListTableItem;
