import Layout from "../components/Layout";
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils";
import { bookmarkPost, deletePost, likePost } from "../utils/firebase/api";
import Post from "../components/posts/Post";
import { useRouter } from "next/router";
import Masonry from "@mui/lab/Masonry";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import { useState } from "react";
import Dialog from "./primitives/Dialog";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { Stack } from "@mui/material";
import SelectCategory from "./SelectCategory";
import Posts from "./posts/Posts";

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

const PageMain = ({ posts = [], category, title, enableLink = false }) => {
  const [showDialog, setShowDialog] = useState({ open: false, content: "", onOkClick: () => {} });
  const [user] = useAuthState(getAuth());
  const { set: setQuery } = useDebouncedQuery(1000);
  const router = useRouter();

  const onEditHandler = ({ id }) => {
    router.push("/create?id=" + id);
  };

  const onDeleteHandler = ({ id }) => {
    setShowDialog({
      ...showDialog,
      open: true,
      content: "Are you sure you want to delete this post?",
      onOkClick: () => deletePost(id),
    });
  };

  const onLikeHandler = async ({ id }) => {
    await likePost(id);
  };

  const onBookmarkHandler = async ({ id }) => {
    await bookmarkPost(id);
  };

  const onSearchHandler = (value) => {
    setQuery({ search: value });
  };

  const onCategoryChangeHandler = (value) => {
    router.push("/category/" + value);
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
              onChange={(e) => onSearchHandler(e.currentTarget.value.toLowerCase())}
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          <SelectCategory onChange={onCategoryChangeHandler} value={category} />
        </StyledSearchBar>
        <Posts
          enableLink={enableLink}
          posts={posts}
          onEdit={onEditHandler}
          onDelete={onDeleteHandler}
          onLike={onLikeHandler}
          onBookmark={onBookmarkHandler}
        />
      </Layout>
    </>
  );
};

export default PageMain;
