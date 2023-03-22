import { AppBar, Toolbar, Button, IconButton, useTheme, Popover, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import UserAvatar from "./UserAvatar";
import { FC, ReactNode, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import LoginIcon from "@mui/icons-material/Login";
import Search from "./primitives/Search";
import styled from "styled-components";
import { getQuery, useDebouncedQuery } from "../utils/queryUtils";
import _ from "lodash";
import { useUser } from "reactfire";
import MenuIcon from "@mui/icons-material/Menu";

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
  @media (min-width: 600px) {
    margin-left: ${({ theme }) => theme.spacing(3)};
    margin-right: ${({ theme }) => theme.spacing(4)};
  }
  margin-left: ${({ theme }) => theme.spacing(0)};
  margin-right: ${({ theme }) => theme.spacing(1)};
  border-radius: 16px;
`;

const TopBar: FC<{ onClickLogo: () => void; className?: string; actions?: ReactNode }> = ({
  onClickLogo,
  className,
  actions,
  ...props
}) => {
  const isDesktop = useMediaQuery("(min-width:600px)");
  const { data: user } = useUser();
  const router = useRouter();
  const [searchStr, setSearchStr] = useState(router.query.search);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const refArrrow = useRef();
  const { query, set: setQuery } = useDebouncedQuery();

  const onSearchEnterHandler = () => {
    //const newQuery = { ...getQuery(), search: searchStr };
    const newQuery = _.pickBy({ ...getQuery(), search: searchStr }, _.identity);
    router.push({ pathname: router.asPath.split("?")[0], query: newQuery });
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
            onClickLogo();
          }}
        >
          {/* <StepsLogoIconFold height={36} /> */}
          <MenuIcon fontSize="large"></MenuIcon>
        </IconButton>
        {/* SEARCH */}
        {actions || (
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
        )}

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
