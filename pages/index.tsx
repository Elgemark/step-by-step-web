import Layout from "../components/Layout";
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils";
import { searchPosts, getPosts, deletePost, likePost } from "../utils/firebase/api";
import Post from "../components/posts/Post";
import { useRouter } from "next/router";
import Masonry from "@mui/lab/Masonry";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { toSanitizedArray } from "../utils/stringUtils";
import PageMain from "../components/PageMain";

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

export default function IndexPage(props) {
  return <PageMain {...props} title="STEPS" />;
}

export async function getServerSideProps({ query }) {
  const tags = toSanitizedArray(query.search);
  const category = query.category;
  const posts = tags.length ? await searchPosts(tags, category) : await getPosts();
  return { props: { posts } };
}
