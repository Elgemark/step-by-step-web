import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useGetCategories } from "../../utils/firebase/api";
import SelectDropDown from "./SelectDropDown";

const SelectCategory = ({ onChange, ...props }) => {
  const categories = useGetCategories();
  return <SelectDropDown onChange={onChange} label="Category" options={categories} {...props} />;
};

export default SelectCategory;
