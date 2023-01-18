import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { alpha, useTheme } from "@mui/material/styles";
import styled from "styled-components";

import { FC } from "react";

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

const Search: FC<{ onChange: (e: any) => void; onEnter?: () => void; value: string | null }> = ({
  onChange,
  onEnter,
  value,
  ...rest
}) => {
  const theme = useTheme();

  const onKeyUpHandler = (e) => {
    if (e.keyCode === 13) {
      onEnter && onEnter();
    }
  };

  return (
    <Root theme={theme} {...rest}>
      <SearchIcon />
      <InputBase
        value={value}
        onChange={onChange}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        onKeyUp={onKeyUpHandler}
      />
    </Root>
  );
};

export default Search;
