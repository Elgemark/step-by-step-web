
import FloatingTopBar from "./primitives/FloatingTopBar";
import styled from "styled-components";
import DropDown from "./primitives/DropDown";
import { useCategories } from "../utils/firebase/api/categories";

const FilterBar = ({ , onClickCategories }) => {

  const {categories,isLoading:isLoadingCategories} = useCategories();

  const onSelectCategoriesHandler = (option) => {

  }

  return (
    <FloatingTopBar>
      <DropDown options={[{ value: "test", label: "test" }]} onSelect={onSelectCategoriesHandler}></DropDown>
    </FloatingTopBar>
  );
};

export default FilterBar;
