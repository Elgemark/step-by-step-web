import { useCategories } from "../utils/firebase/api";
import SelectDropDown from "./primitives/SelectDropDown";

const SelectCategory = ({ onChange, ...props }) => {
  const { categories, isLoading } = useCategories();

  const options = categories.map((category) => ({ label: category.text, value: category.value }));

  if (isLoading) {
    return null;
  } else {
    return <SelectDropDown onChange={onChange} label="Category" options={options} {...props} />;
  }
};

export default SelectCategory;
