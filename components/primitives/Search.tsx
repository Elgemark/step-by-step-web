import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, useTheme } from "@mui/material/styles";
import styled from "styled-components";
import { FC } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import { IconButton } from "@mui/material";

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
`;

const Search: FC<{
  onChange: (e: any) => void;
  onFocus: (e: any) => void;
  onBlur: (e: any) => void;
  onEnter?: () => void;
  onClickFilter?: (e: any) => void;
  value: string | null;
  fwdRef?: HTMLElement | null;
}> = ({ onChange, onEnter, onFocus, onBlur, onClickFilter, value, fwdRef, ...rest }) => {
  const theme = useTheme();

  const onKeyUpHandler = (e) => {
    if (e.keyCode === 13) {
      onEnter && onEnter();
    }
  };

  return (
    <Root theme={theme} ref={fwdRef} {...rest}>
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
      <IconButton onClick={onClickFilter}>
        <FilterListIcon />
      </IconButton>
    </Root>
  );
};

export default Search;
