import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useGetCategories } from "../../utils/firebase/api";

const SelectCategory = ({ onChange, value, ...props }) => {
  const categories = useGetCategories();

  return (
    <FormControl sx={{ minWidth: 200 }} size="small" {...props}>
      <InputLabel id="select-value-label">Category</InputLabel>
      <Select value={value} label="Category" onChange={(e) => onChange(e.target.value)}>
        {categories.map((category) => (
          <MenuItem value={category}>{category}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectCategory;
