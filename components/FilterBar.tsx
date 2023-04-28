import FloatingTopBar from "./primitives/FloatingTopBar";
import { useCategories } from "../utils/firebase/api/categories";
import SelectDropDown from "./primitives/SelectDropDown";
import { Stack, useMediaQuery } from "@mui/material";
import Rate from "./primitives/Rate";
import BorderBox from "./primitives/BorderBox";
import { getBasePath, getQuery } from "../utils/queryUtils";
import styled from "styled-components";
import { useRouter } from "next/router";
import { FC } from "react";

const StyledOutlinedBox = styled(BorderBox)`
  padding: 0 4px;
`;

const FilterBar: FC<{ enableRate?: boolean; enableCategory?: boolean }> = ({
  enableRate = true,
  enableCategory = true,
}) => {
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width:600px)");

  const onChangeCategoryHandler = (value) => {
    if (value === null) {
      router.push({ pathname: `/posts/search/`, query: getQuery() });
    } else {
      router.push({ pathname: `/posts/category/${value}`, query: getQuery() });
    }
  };

  const onClickRateHandler = (value) => {
    const oldValue = Number(router.query.rated) || 0;
    const rated = oldValue === value && value > 0 ? value - 1 : value;
    router.replace({ pathname: getBasePath(), query: { ...getQuery(), rated } });
  };

  const allCategories = categories.map((category) => ({ label: category.text, value: category.value }));
  allCategories.splice(0, 0, { label: "any", value: null });

  return (
    <FloatingTopBar>
      <Stack spacing={2} direction={isDesktop ? "row" : "column"}>
        {enableCategory ? (
          <SelectDropDown
            onChange={onChangeCategoryHandler}
            label={isLoadingCategories ? "loading..." : "Category"}
            value={router.query.category as string}
            options={allCategories}
          />
        ) : null}
        {enableRate ? (
          <StyledOutlinedBox label="Rated">
            <Rate size="small" onClick={onClickRateHandler} value={Number(router.query.rated) || 0} />
          </StyledOutlinedBox>
        ) : null}
      </Stack>
    </FloatingTopBar>
  );
};

export default FilterBar;
