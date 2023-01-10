import { Post, Step, List, Bookmark } from "../interface";

export type Posts = Array<Post>;
export type Lists = Array<List>;
export type Steps = Array<Step>;
export type Bookmarks = Array<Bookmark>;
export type ImageUploads = Array<{ blob: Blob | File; imageSize: string; locationPath: Array<string> }>;
