import { Divider, Paper, Typography, useTheme } from "@mui/material";
import { FC } from "react";
import { useCategories } from "../utils/firebase/api/categories";
import SelectChips, { ChipItem } from "./primitives/SelectChips";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  width: 400px;
  max-width: 800px;
  min-height: 400px;
  padding: ${({ theme }) => theme.spacing(2)};
  .MuiTypography-body1 {
    margin-bottom: ${({ theme }) => theme.spacing(0.5)};
  }
`;

const SearchFilter: FC<{
  onSelectCategory: (category: string | ChipItem) => void;
  selectedCategory: string;
  onSelectOrderBy: (category: string | ChipItem) => void;
  selectedOrderBy: string;
}> = ({ onSelectCategory, selectedCategory, onSelectOrderBy, selectedOrderBy }) => {
  const theme = useTheme();
  const { categories } = useCategories();

  return (
    <StyledPaper theme={theme} elevation={3}>
      <Typography variant="body1">Category</Typography>
      <Divider></Divider>
      <SelectChips items={categories} selectedItems={[selectedCategory]} onSelect={(e) => onSelectCategory(e)} />
      <Typography variant="body1">Order by</Typography>
      <Divider></Divider>
      <SelectChips
        items={["likes", "latest", "completions"]}
        selectedItems={[selectedOrderBy]}
        onSelect={(e) => onSelectOrderBy(e)}
      />
    </StyledPaper>
  );
};

export default SearchFilter;
