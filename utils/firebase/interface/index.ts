import { Bookmarks, Lists, Posts } from "../type";

export interface Media {
  imageURI: string | null;
}

export interface Post {
  id: string;
  title: string;
  descr: string;
  media: Media;
  tags: Array<string>;
  lists?: Lists;
  category: string;
  likes: number;
  stepsCompleted: number;
  userId: string;
  visibility: "draft" | "public";
}

export interface Step {
  id: string;
  body: string;
  title: string;
  media: Media;
}

export interface Steps {
  id: string;
  steps: Array<Step> | [];
}

export interface Bookmark {
  postId: string;
}

export interface ListItem {
  text: string;
  value: string;
}

export interface List {
  id: string;
  title: string;
  items: Array<ListItem>;
}

//::::::
//:::::: RESPONSE INTERFACES
//::::::

export interface ListResponse {
  id: string;
  data: Lists | [];
  error: string | null;
}

export interface BookmarksResponse {
  data: Bookmarks | null;
  error: any;
}

export interface BookmarkResponse {
  data: Bookmark | null;
  error: any;
}

export interface PostsResponse {
  data: Posts;
  error: string | null;
  lastDoc?: any;
}

export interface StepsResponse {
  data: Steps | null;
  error: string | null;
}

export interface UploadResponse {
  error: string | null;
  url: string | null;
}

export interface FollowResponse {
  error: string | null;
  data: object | null;
}

export interface FollowersResponse {
  error: string | null;
  data: Array<any> | [];
}
