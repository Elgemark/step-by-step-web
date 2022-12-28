import Layout from "../components/Layout";
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils";
import { useRouter } from "next/router";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
// Firebase related
import { Stack } from "@mui/material";
import SelectCategory from "./SelectCategory";
import Posts from "./posts/Posts";
import { FC } from "react";
import { Posts as PostsType } from "../utils/firebase/type";
import { useScrolledToBottom } from "../utils/scrollUtils";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "100%",
  marginBottom: theme.spacing(2),
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

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledSearchBar = styled(Stack)(({ theme }) => ({
  "@media (min-width: 600px)": {
    marginRight: theme.spacing(1),
  },

  "@media (min-width: 900px)": {
    marginRight: theme.spacing(2),
  },
  "@media (min-width: 1200px)": {
    marginRight: theme.spacing(4),
  },
}));

const PageMain: FC<{
  search: string;
  posts: Array<PostsType>;
  category: string;
  title: string;
  enableLink: boolean;
}> = ({ search, posts = [], category, title, enableLink = false }) => {
  const isBottom = useScrolledToBottom();
  const { set: setQuery, query } = useDebouncedQuery({ search });
  const router = useRouter();

  const onSearchHandler = (value) => {
    setQuery({ search: value });
  };

  const onCategoryChangeHandler = (value) => {
    router.push({ pathname: "/category/" + value, query: { search: query.search } });
  };
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{title}</title>
      </Head>
      <Layout>
        <StyledSearchBar direction="row" spacing={2}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              value={query.search}
              onChange={(e) => onSearchHandler(e.currentTarget.value.toLowerCase())}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <SelectCategory onChange={onCategoryChangeHandler} value={category} />
        </StyledSearchBar>
        <Posts enableLink={enableLink} posts={posts} />
      </Layout>
    </>
  );
};

export default PageMain;
