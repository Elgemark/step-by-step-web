import { AppBar, Toolbar, Button, Typography, IconButton, Box, useTheme, Popover, Popper, Paper } from "@mui/material";
import { useRouter } from "next/router";
import StepsLogo from "./primitives/StepsLogo";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import UserAvatar from "./UserAvatar";
import { FC, ReactNode, useContext, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import LoginIcon from "@mui/icons-material/Login";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "./Layout";
import Search from "./primitives/Search";
import styled from "styled-components";
import SearchFilter from "./SearchFilter";
import { useDebouncedQuery } from "../utils/queryUtils";
import _ from "lodash";

const StyledSearch = styled(Search)`
  margin: 0 ${({ theme }) => theme.spacing(2)};
`;

const popperModifiers = [
  {
    name: "flip",
    enabled: true,
    options: {
      altBoundary: true,
      rootBoundary: "document",
      padding: 8,
    },
  },
  {
    name: "preventOverflow",
    enabled: true,
    options: {
      altAxis: true,
      altBoundary: true,
      tether: true,
      rootBoundary: "document",
      padding: 8,
    },
  },
  // {
  //   name: "arrow",
  //   enabled: true,
  //   options: {
  //     element: refArrrow,
  //   },
  // },
];

const TopBar: FC<{ className?: string; actions?: ReactNode; search?: string }> = ({
  className,
  actions,
  search,
  ...props
}) => {
  const [user] = useAuthState(getAuth());
  const router = useRouter();
  const [searchStr, setSearchStr] = useState();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const refArrrow = useRef();
  const { query, set: setQuery } = useDebouncedQuery();

  const onSearchEnterHandler = () => {
    router.push({ pathname: "/posts/search/", query: { search: searchStr } });
    setAnchorEl(null);
  };

  console.log("query", query);
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

  return (
    <AppBar {...props}>
      <Toolbar>
        {/* LOGO */}
        <Button
          color="inherit"
          onClick={() => {
            if (user) {
              router.push("/posts/user/" + user.uid);
            } else {
              router.push("/posts/");
            }
          }}
        >
          <StepsLogo width={100}></StepsLogo>
        </Button>
        {/* SEARCH */}
        <StyledSearch
          theme={theme}
          onEnter={onSearchEnterHandler}
          onChange={(e) => setSearchStr(e.currentTarget.value.toLowerCase())}
          onFocus={onSearchFocusHandler}
          onBlur={onFocusBlurHandler}
          onClickFilter={onClickFilterHandler}
          value={search}
        ></StyledSearch>
        {/* FILTER */}
        <Popover
          // style={{ zIndex: 9999 }}
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
          // disablePortal={false}
          // modifiers={popperModifiers}
        >
          <div data-popper-arrow ref={refArrrow}></div>
          <SearchFilter
            selectedCategories={[_.get(query, "category")]}
            onSelectCategory={onSelectCategoryHandler}
          ></SearchFilter>
        </Popover>
        {/* CREATE */}
        {user && (
          <Button
            size="small"
            startIcon={<CreateIcon />}
            variant="contained"
            onClick={() => {
              router.push("/create/" + uuid()).then(() => {
                router.reload();
              });
            }}
          >
            Create
          </Button>
        )}
        {/* THEME */}
        {/* <IconButton size="small" onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? <Brightness7Icon fontSize="12px" /> : <Brightness4Icon fontSize="12px" />}
        </IconButton> */}
        {/* LOGIN */}
        {!user && (
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
        )}
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
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
