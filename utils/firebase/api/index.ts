import * as userApi from "./user";
import * as followApi from "./follow";
import * as storageApi from "./storage";
import * as postApi from "./post";
import * as listApi from "./list";
import * as stepApi from "./step";
import * as bookmarksApi from "./bookmarks";
import * as likesApi from "./likes";
import * as categoriesApi from "./categories";
// User
// Follow
export const follow = followApi.follow;
export const getFollowers = followApi.getFollowers;
export const getFollows = followApi.getFollows;
export const getLeaderForFollower = followApi.getLeaderForFollower;
export const useFollow = followApi.useFollow;
// :::Storage
export const useUploadFileAsBlob = storageApi.useUploadFileAsBlob;
export const uploadImage = storageApi.uploadImage;
/// :::USERS
export const setUser = userApi.setUser;
export const updateUser = userApi.updateUser;
export const getCurrentUser = userApi.getCurrentUser;
export const getUser = userApi.getUser;
export const useUser = userApi.useUser;
// ::: POSTS
export const getBookmarkedPosts = postApi.getBookmarkedPosts;
export const getCreatedPosts = postApi.getCreatedPosts;
export const getPostsByState = postApi.getPostsByState;
export const getPost = postApi.getPost;
export const deletePost = postApi.deletePost;
// BOOKMARKS
export const addBookmark = bookmarksApi.addBookmark;
export const deleteBookmark = bookmarksApi.deleteBookmark;
export const useBookmarks = bookmarksApi.useBookmarks;
export const isBookmarkedByUser = bookmarksApi.isBookmarkedByUser;
// ::: LISTS
export const getLists = listApi.getLists;
export const setLists = listApi.setLists;
export const setList = listApi.setList;
export const deleteList = listApi.deleteList;
export const useLists = listApi.useLists;
// ::: STEPS
export const setSteps = stepApi.setSteps;
export const getSteps = stepApi.getSteps;
// ::: LIKES POST
export const likePost = likesApi.likePost;
export const isPostLikedByUser = likesApi.isPostLikedByUser;
export const useLikes = likesApi.useLikes;
// ::: CATEGORIES
export const getCategories = categoriesApi.getCategories;
export const useGetCategories = categoriesApi.useGetCategories;
