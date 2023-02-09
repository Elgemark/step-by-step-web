import { Bookmarks, Lists, Posts, PostVisibility, Steps } from "../type";

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
  uid: string;
  visibility: PostVisibility;
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
