import { AppBar, Toolbar, Button, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import StepsLogo from "./primitives/StepsLogo";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const TopBar = ({ onSearch }) => {
  const router = useRouter();

  return (
    <AppBar>
      <Toolbar>
        <Button
          color="inherit"
          onClick={() => {
            router.push("/");
          }}
        >
          <StepsLogo width={100}></StepsLogo>
        </Button>

        {onSearch && (
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={(e) => onSearch(e.currentTarget.value.toLowerCase())}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
        )}
        <Typography component="div" sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          onClick={() => {
            router.push("/create");
          }}
        >
          Create
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
