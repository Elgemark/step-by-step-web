import FloatingTopBar from "./primitives/FloatingTopBar";
import { useCategories } from "../utils/firebase/api/categories";
import SelectDropDown from "./primitives/SelectDropDown";
import { Stack } from "@mui/material";
import Rate from "./primitives/Rate";
import OutlinedBox from "./primitives/OutlinedBox";
import { getQuery, useDebouncedQuery } from "../utils/queryUtils";
import styled from "styled-components";

const StyledOutlinedBox = styled(OutlinedBox)`
  padding: 0 4px;
`;

const FilterBar = ({}) => {
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { query, set: setQuery } = useDebouncedQuery({}, { debounceWait: 10 });

  const onChangeCategoryHandler = (value) => {
    //setQuery({ category: value });
  };

  const onClickRateHandler = (value) => {
    const oldValue = query.rated || 0;
    setQuery({ rated: oldValue === 1 && value === 1 ? 0 : value });
    console.log("val", String(value));
  };

  return (
    <FloatingTopBar>
      <Stack spacing={2} direction="row">
        <SelectDropDown
          onChange={onChangeCategoryHandler}
          label="Category"
          value={query.category}
          options={categories.map((category) => ({ label: category.text, value: category.value }))}
        />
        <StyledOutlinedBox>
          <Rate size="small" onClick={onClickRateHandler} value={query.rated || 0} />
        </StyledOutlinedBox>
      </Stack>
    </FloatingTopBar>
  );
};

export default FilterBar;
