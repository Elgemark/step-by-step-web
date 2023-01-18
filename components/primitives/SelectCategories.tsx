import { Stack } from "@mui/material";
import { FC } from "react";
import { Chip } from "@mui/material";

const SelectCategories: FC<{
  onSelect?: (selectedCategory: string) => void;
  categories: Array<string>;
  selectedCategories: Array<string>;
}> = ({ categories, onSelect, selectedCategories = [] }) => {
  return (
    <Stack direction="row" flexWrap="wrap">
      {categories &&
        categories.map((category) => (
          <Chip
            className="chip"
            onClick={() => onSelect && onSelect(category)}
            label={category}
            color={selectedCategories.includes(category) ? "primary" : undefined}
          />
        ))}
    </Stack>
  );
};

export default SelectCategories;
