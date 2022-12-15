import { v4 as uuid } from "uuid";

export interface Post{
  
}

export const post = {
  title: "",
  descr: "",
  media: { imageURI: "" },
  tags: [],
  prerequisites: [],
  category: null,
  likes: 0,
  stepsCompleted: 0,
  userId: null,
  visibility: "draft", // draft || public
};
export const userProfile = {
  roles: ["user"],
  domains: [],
  avatar: null, // url
  alias: null,
};
export const steps = { steps: [] };
export const step = { body: "", title: "", media: { imageURI: null, id: null } };
export const userStepsProgress = { userId: null, step: 0, completed: false };
// CREATE FUNCTIONS
export const createStep = () => ({ ...step, id: uuid() });
