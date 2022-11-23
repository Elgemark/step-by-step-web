import Layout from "../components/Layout";
import Head from "next/head";
import { useDebouncedQuery } from "../utils/queryUtils";
import { deletePost, getCategories, likePost, useGetCategories } from "../utils/firebase/api";
import Post from "../components/posts/Post";
import { useRouter } from "next/router";
import Masonry from "@mui/lab/Masonry";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// Firebase related
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { Stack } from "@mui/material";

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

const StyleFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: "200px",
}));

const PageMain = ({ posts = [], category, title }) => {
  const [user] = useAuthState(getAuth());
  const { set: setQuery } = useDebouncedQuery(1000);
  const router = useRouter();
  const categories = useGetCategories();

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

  const onCategoryChangeHandler = (e) => {
    router.push("/category/" + e.target.value);
  };
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>{title}</title>
      </Head>
      <Layout>
        <Stack direction="row" spacing={2}>
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
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="select-category-label">Category</InputLabel>
            <Select value={category} label="Category" onChange={onCategoryChangeHandler}>
              {categories.map((category) => (
                <MenuItem value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
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
