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

const SelectCategories: FC<{
  onSelect?: (category: string) => void;
  categories: Array<string>;
  selectedCategories: Array<string>;
}> = ({ categories, onSelect, selectedCategories = [] }) => {
  const theme = useTheme();
  return (
    <StyledStack theme={theme} direction="row" flexWrap="wrap">
      {categories &&
        categories.map((category) => (
          <Chip
            className="chip"
            onClick={() => onSelect && onSelect(category)}
            label={category}
            color={selectedCategories.includes(category) ? "primary" : undefined}
          />
        ))}
    </StyledStack>
  );
};

export default SelectCategories;
