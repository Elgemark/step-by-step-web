import { AppBar, Toolbar, Button, IconButton, useTheme, Popover, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import UserAvatar from "./UserAvatar";
import { FC, ReactNode, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import CreateIcon from "@mui/icons-material/Create";
import LoginIcon from "@mui/icons-material/Login";
import Search from "./primitives/Search";
import styled from "styled-components";
import { getBasePath, getQuery } from "../utils/queryUtils";
import _ from "lodash";
import { useUser } from "reactfire";
import MenuIcon from "@mui/icons-material/Menu";
import { includesAny } from "../utils/arrayUtils";
import { useEffect } from "react";

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
  const [searchStr, setSearchStr] = useState(router.query.search || "");
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const refArrrow = useRef();

  useEffect(() => {
    setSearchStr(getQuery()?.search || "");
  }, []);

  const onSearchEnterHandler = () => {
    // setQuery({ search: searchStr });
    if (includesAny(getBasePath().split("/"), ["search", "category"])) {
      router.replace({ pathname: getBasePath(), query: { ...getQuery(), search: searchStr } });
    } else {
      router.push({ pathname: `/posts/search/`, query: { ...getQuery(), search: searchStr } });
    }

    setAnchorEl(null);
  };

  const onSearchFocusHandler = (e) => {};

  const onFocusBlurHandler = (e) => {
    // setAnchorEl(null);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
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
          <MenuIcon fontSize="large"></MenuIcon>
        </IconButton>
        {/* SEARCH */}
        {actions || (
          <StyledSearch
            theme={theme}
            onEnter={onSearchEnterHandler}
            onClear={onSearchEnterHandler}
            onChange={(e) => setSearchStr(e.currentTarget.value.toLowerCase())}
            onFocus={onSearchFocusHandler}
            onBlur={onFocusBlurHandler}
            value={searchStr}
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
