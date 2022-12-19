impo;

export interface Media {
  imageURI: string | null;
}

export interface Post {
  id?: string;
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
