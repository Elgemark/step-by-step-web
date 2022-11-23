import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useGetCategories } from "../../utils/firebase/api";

const SelectCategory = ({ onCategoryChange, category, ...props }) => {
  const categories = useGetCategories();

  return (
    <FormControl sx={{ minWidth: 200 }} size="small" {...props}>
      <InputLabel id="select-category-label">Category</InputLabel>
      <Select value={category} label="Category" onChange={onCategoryChange}>
        {categories.map((category) => (
          <MenuItem value={category}>{category}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCategory;
