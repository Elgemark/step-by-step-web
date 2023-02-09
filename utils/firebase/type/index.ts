import { Post, Step, Bookmark } from "../interface";

export type Posts = Array<Post>;

export type Steps = Array<Step>;
export type Bookmarks = Array<Bookmark>;
export type ImageUploads = Array<{ blob: Blob | File; imageSize: string; locationPath: Array<string>; id?: string }>;
export type PostVisibility = "draft" | "public" | "review" | "rejected";
