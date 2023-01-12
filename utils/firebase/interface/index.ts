import { Bookmarks, Lists, Posts, Steps } from "../type";

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
  index: number;
  body: string;
  title: string;
  media: Media;
  completed?: boolean;
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

export interface Progress {
  completed: boolean;
  completions: number;
  id: string;
  step: number;
  userId: string;
}

//::::::
//:::::: RESPONSE INTERFACES
//::::::

export interface ProgressResponse {
  id: string;
  data: Progress;
  error: any;
}

export interface ListResponse {
  id: string;
  data: List | [];
  error: any;
}

export interface ListsResponse {
  id: string;
  data: Lists | null;
  error: any;
}

export interface BookmarksResponse {
  data: Bookmarks | null;
  error: any;
}

export interface BookmarkResponse {
  data: Bookmark | null;
  error: any;
}
export interface PostResponse {
  data: Post;
  error: string | null;
}

export interface PostsResponse {
  data: Posts;
  error: string | null;
  lastDoc?: any;
}

export interface StepsResponse {
  data: Steps;
  error: string | null;
}

export interface StepResponse {
  data: Step;
  error: string | null;
}

export interface UploadResponse {
  error: string | null;
  url: string | null;
  id?: string;
}

export interface FollowResponse {
  error: string | null;
  data: object | null;
}

export interface FollowersResponse {
  error: string | null;
  data: Array<any> | [];
}

export interface LikeResponse {
  error: string | null;
  data: object | null;
}

export interface LikesResponse {
  error: string | null;
  data: Array<any> | [];
}

export interface CategoriesResponse {
  error: string | null;
  data: Array<any> | [];
}
