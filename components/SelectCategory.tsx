import { useGetCategories } from "../utils/firebase/api";
import SelectDropDown from "./primitives/SelectDropDown";

const SelectCategory = ({ onChange, ...props }) => {
  const categories = useGetCategories();
  return <SelectDropDown onChange={onChange} label="Category" options={categories} {...props} />;
};

export default SelectCategory;
