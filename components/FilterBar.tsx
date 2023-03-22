import FloatingTopBar from "./primitives/FloatingTopBar";
import styled from "styled-components";
import DropDown from "./primitives/DropDown";
import { useCategories } from "../utils/firebase/api/categories";
import SelectDropDown from "./primitives/SelectDropDown";

const FilterBar = ({}) => {
  const { categories, isLoading: isLoadingCategories } = useCategories();

  const onChangeCategoryHandler = (e) => {};
  return (
    <FloatingTopBar>
      <SelectDropDown
        onChange={onChangeCategoryHandler}
        label="Category"
        options={categories.map((category) => ({ label: category.text, value: category.value }))}
      />
    </FloatingTopBar>
  );
};

export default FilterBar;
