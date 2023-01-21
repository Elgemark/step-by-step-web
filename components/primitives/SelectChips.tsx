import { Stack, useTheme } from "@mui/material";
import { FC } from "react";
import { Chip } from "@mui/material";
import styled from "styled-components";

const StyledStack = styled(Stack)`
  padding: ${({ theme }) => theme.spacing(2)};
  .chip {
    margin-right: ${({ theme }) => theme.spacing(1)};
    margin-bottom: ${({ theme }) => theme.spacing(1)};
  }
`;

interface ChipItem {
  label: string;
  value: string;
}

type ChipItems = Array<ChipItem>;

const SelectChips: FC<{
  onSelect?: (category: string | ChipItem) => void;
  items: Array<string> | ChipItems;
  selectedItems: Array<string>;
}> = ({ items, onSelect, selectedItems = [] }) => {
  const theme = useTheme();
  return (
    <StyledStack theme={theme} direction="row" flexWrap="wrap">
      {items &&
        items.map((item) => (
          <Chip
            className="chip"
            onClick={() => onSelect && onSelect(item)}
            label={item?.label || item}
            color={selectedItems.includes(item) ? "primary" : undefined}
          />
        ))}
    </StyledStack>
  );
};

export default SelectChips;
