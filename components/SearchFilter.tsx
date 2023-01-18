import { Paper } from "@mui/material";
import { FC } from "react";
import { useCategories } from "../utils/firebase/api/categories";
import SelectCategories from "./primitives/SelectCategories";
import styled from "styled-components";

const StyedPaper = styled(Paper)`
  width: 400px;
  max-width: 800px;
  min-height: 400px;
`;

const SearchFilter: FC<{ onSelectCategory: (category: string) => void; selectedCategories: Array<string> }> = ({
  onSelectCategory,
  selectedCategories,
}) => {
  const { categories, isLoading } = useCategories();

  return (
    <StyedPaper sx={{ padding: 1 }} elevation={3}>
      <SelectCategories categories={categories} selectedCategories={selectedCategories} onSelect={onSelectCategory} />
    </StyedPaper>
  );
};

export default SearchFilter;
