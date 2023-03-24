import FloatingTopBar from "./primitives/FloatingTopBar";
import { useCategories } from "../utils/firebase/api/categories";
import SelectDropDown from "./primitives/SelectDropDown";
import { Stack } from "@mui/material";
import Rate from "./primitives/Rate";
import BorderBox from "./primitives/BorderBox";
import { useDebouncedQuery } from "../utils/queryUtils";
import styled from "styled-components";
import { useRouter } from "next/router";

const StyledOutlinedBox = styled(BorderBox)`
  padding: 0 4px;
`;

const FilterBar = ({}) => {
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { query, set: setQuery } = useDebouncedQuery({}, { debounceWait: 10 });
  const router = useRouter();

  const onChangeCategoryHandler = (value) => {
    if (value === null) {
      router.push({ pathname: `/posts/search/`, query });
    } else {
      router.push({ pathname: `/posts/category/${value}`, query });
    }
  };

  const onClickRateHandler = (value) => {
    const oldValue = query.rated || 0;
    setQuery({ rated: oldValue === 1 && value === 1 ? 0 : value });
  };

  const allCategories = categories.map((category) => ({ label: category.text, value: category.value }));
  allCategories.splice(0, 0, { label: "any", value: null });

  return (
    <FloatingTopBar>
      <Stack spacing={2} direction="row">
        <SelectDropDown
          onChange={onChangeCategoryHandler}
          label={isLoadingCategories ? "loading..." : "Category"}
          value={router.query.category as string}
          options={allCategories}
        />
        <StyledOutlinedBox lable="Rated">
          <Rate size="small" onClick={onClickRateHandler} value={query.rated || 0} />
        </StyledOutlinedBox>
      </Stack>
    </FloatingTopBar>
  );
};

export default FilterBar;
