import Layout from "../components/Layout";
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils";
import { deletePost, likePost } from "../utils/firebase/api";
import Post from "../components/posts/Post";
import { useRouter } from "next/router";
import Masonry from "@mui/lab/Masonry";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

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

const PageMain = ({ posts = [], title }) => {
  const [user] = useAuthState(getAuth());
  const { set: setQuery } = useDebouncedQuery(1000);
  const router = useRouter();

  const onEditHandler = ({ id }) => {
    router.push("/create?id=" + id);
  };

  const onDeleteHandler = async ({ id }) => {
    await deletePost(id);
  };

  const onLikeHandler = async ({ id }) => {
    await likePost(id);
  };

  const onSearchHandler = (value) => {
    setQuery({ search: value });
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{title}</title>
      </Head>
      <Layout>
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
        <Masonry spacing={2} columns={{ lg: 4, md: 3, sm: 2, xs: 1 }}>
          {posts.map((data, index) => (
            <Post
              key={index}
              style={{ width: "100%" }}
              onEdit={
                user?.uid === data.userId
                  ? () => {
                      onEditHandler(data);
                    }
                  : undefined
              }
              onDelete={
                user?.uid === data.userId
                  ? () => {
                      onDeleteHandler(data);
                    }
                  : undefined
              }
              onLike={() => onLikeHandler(data)}
              {...data}
            />
          ))}
        </Masonry>
      </Layout>
    </>
  );
};

export default PageMain;
