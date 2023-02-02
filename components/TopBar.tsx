import { AppBar, Toolbar, Button, IconButton, useTheme, Popover, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import UserAvatar from "./UserAvatar";
import { FC, ReactNode, useContext, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import LoginIcon from "@mui/icons-material/Login";
import Search from "./primitives/Search";
import styled from "styled-components";
import SearchFilter from "./SearchFilter";
import { useDebouncedQuery } from "../utils/queryUtils";
import _ from "lodash";
import { useUser } from "reactfire";
import StepsLogoIconFold from "./primitives/StepsLogoIconFold";
import IconStepsFoldLogo from "./primitives/IconStepsFoldLogo";

const StyledAppbar = styled(AppBar)`
  align-items: center;
`;

const StyledToolbar = styled(Toolbar)`
  width: 100%;
  @media (min-width: 1024px) {
    width: 1024px;
  }
`;

const StyledSearch = styled(Search)`
  margin-left: ${({ theme }) => theme.spacing(1)};
  margin-right: ${({ theme }) => theme.spacing(2)};
`;

const TopBar: FC<{ className?: string; actions?: ReactNode }> = ({ className, actions, ...props }) => {
  const isDesktop = useMediaQuery("(min-width:600px)");
  const { data: user } = useUser();
  const router = useRouter();
  const [searchStr, setSearchStr] = useState(router.query.search);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const refArrrow = useRef();
  const { query, set: setQuery } = useDebouncedQuery();

  const onSearchEnterHandler = () => {
    router.push({ pathname: "/posts/search/", query: { search: searchStr } });
    setAnchorEl(null);
  };

  const onSearchFocusHandler = (e) => {};

  const onFocusBlurHandler = (e) => {
    // setAnchorEl(null);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const onClickFilterHandler = (e) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const onSelectCategoryHandler = (category) => {
    if (_.get(query, "category") === category) {
      setQuery({ category: null });
    } else {
      setQuery({ category });
    }
  };

  const onSelecteOrderBy = (orderBy) => {
    if (_.get(query, "orderBy") === orderBy) {
      setQuery({ orderBy: null });
    } else {
      setQuery({ orderBy });
    }
  };

  return (
    <StyledAppbar {...props}>
      <StyledToolbar disableGutters theme={theme}>
        {/* LOGO */}
        <IconButton
          onClick={() => {
            if (user) {
              router.push("/posts/user/" + user.uid);
            } else {
              router.push("/posts/");
            }
          }}
        >
          {/* <StepsLogoIconFold height={36} /> */}
          <IconStepsFoldLogo fontSize="large"></IconStepsFoldLogo>
        </IconButton>
        {/* SEARCH */}
        <StyledSearch
          theme={theme}
          onEnter={onSearchEnterHandler}
          onChange={(e) => setSearchStr(e.currentTarget.value.toLowerCase())}
          onFocus={onSearchFocusHandler}
          onBlur={onFocusBlurHandler}
          onClickFilter={onClickFilterHandler}
          showFilterButton={router.asPath.includes("/search")}
          value={searchStr}
          numFilters={(_.get(query, "category") ? 1 : 0) + (_.get(query, "orderBy") ? 1 : 0)}
        ></StyledSearch>
        {/* FILTER */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleFilterClose}
          marginThreshold={42}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <div data-popper-arrow ref={refArrrow}></div>
          <SearchFilter
            selectedCategory={_.get(query, "category")}
            selectedOrderBy={_.get(query, "orderBy")}
            onSelectCategory={onSelectCategoryHandler}
            onSelectOrderBy={onSelecteOrderBy}
          ></SearchFilter>
        </Popover>
        {/* CREATE */}
        {user && (
          <IconButton
            size="small"
            onClick={() => {
              router.push("/create/" + uuid()).then(() => {
                router.reload();
              });
            }}
          >
            <CreateIcon />
          </IconButton>
        )}
        {/* THEME */}
        {/* <IconButton size="small" onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? <Brightness7Icon fontSize="12px" /> : <Brightness4Icon fontSize="12px" />}
        </IconButton> */}
        {/* LOGIN */}
        {!user &&
          (isDesktop ? (
            <Button
              size="small"
              startIcon={<LoginIcon />}
              variant="contained"
              onClick={() => {
                router.push("/login");
              }}
            >
              Login
            </Button>
          ) : (
            <IconButton
              onClick={() => {
                router.push("/login");
              }}
            >
              <LoginIcon />
            </IconButton>
          ))}
        {/* PROFILE */}
        {user && (
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            onClick={() => {
              router.push("/profile/" + user.uid);
            }}
            color="inherit"
          >
            <UserAvatar size={36} realtime />
          </IconButton>
        )}
      </StyledToolbar>
    </StyledAppbar>
  );
};

export default TopBar;
