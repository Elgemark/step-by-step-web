import { useGetCategories } from "../utils/firebase/api";
import SelectDropDown from "./primitives/SelectDropDown";

const SelectCategory = ({ onChange, ...props }) => {
  const { categories, isLoading } = useGetCategories();
  if (isLoading) {
    return null;
  } else {
    return <SelectDropDown onChange={onChange} label="Category" options={categories} {...props} />;
  }
};

export default SelectCategory;
