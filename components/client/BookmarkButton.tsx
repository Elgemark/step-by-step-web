"use client";

import { CircularProgress, IconButton } from "@mui/material";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { FC } from "react";
import { useBookmarks } from "../../utils/firebase/api";

const BookmarkButton: FC<{ postId: string }> = ({ postId }) => {
  const { isBookmarked, toggle: toogleBookmark, isLoading } = useBookmarks(postId);

  const onBookmarkHandler = () => {
    toogleBookmark(postId);
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <IconButton aria-label="bookmark" onClick={onBookmarkHandler}>
          {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </IconButton>
      )}
    </>
  );
};

export default BookmarkButton;
