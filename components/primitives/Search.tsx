import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, useTheme } from "@mui/material/styles";
import styled from "styled-components";
import { FC } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Badge, IconButton } from "@mui/material";

const Root = styled.div`
  border-radius: ${({ theme }) => theme.shape.borderRadius + "px"};
  background-color: ${({ theme }) => alpha(theme.palette.common.white, 0.1)};
  flex-grow: 1;
  display: flex;
  align-items: center;
  max-height: 32px;
  padding: ${({ theme }) => theme.spacing(1)};
  .MuiInputBase-root {
    margin: 0 ${({ theme }) => theme.spacing(2)};
    flex-grow: 1;
  }
  .filter-button {
    opacity: ${({ showFilterButton }) => (showFilterButton ? 1 : 0)};
    pointer-events: ${({ showFilterButton }) => (showFilterButton ? "auto" : "none")};
    transition: opacity 0.4s;
  }
`;

const Search: FC<{
  onChange: (e: any) => void;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;
  onEnter?: () => void;
  onClickFilter?: (e: any) => void;
  value: string | null;
  showFilterButton?: boolean;
  numFilters?: number;
}> = ({ onChange, onEnter, onFocus, onBlur, onClickFilter, value, numFilters, showFilterButton = true, ...rest }) => {
  const theme = useTheme();

  const onKeyUpHandler = (e) => {
    if (e.keyCode === 13) {
      onEnter && onEnter();
    }
  };

  return (
    <Root theme={theme} {...rest} showFilterButton={showFilterButton}>
      <SearchIcon />
      <InputBase
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        onKeyUp={onKeyUpHandler}
      />
      <Badge badgeContent={numFilters} color="primary" overlap="circular">
        <IconButton className="filter-button" onClick={onClickFilter}>
          <FilterListIcon />
        </IconButton>
      </Badge>
    </Root>
  );
};

export default Search;
