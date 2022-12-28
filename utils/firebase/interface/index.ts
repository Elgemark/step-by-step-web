import { Lists, Posts } from "../type";

export interface Media {
  imageURI: string | null;
}

export interface Post {
  id: string;
  title: string;
  descr: string;
  media: Media;
  tags: Array<string>;
  prerequisites?: Array<string>;
  category: string;
  likes: number;
  stepsCompleted: number;
  userId: string;
  visibility: "draft" | "public";
}

export interface Step {
  body: string;
  title: string;
  media: Media;
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

export interface ListResponse {
  id: string;
  data: Lists | [];
  error: string | null;
}

export interface PostsResponse {
  data: Posts | [];
  error: string | null;
}
