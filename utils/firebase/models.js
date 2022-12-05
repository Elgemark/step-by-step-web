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
export const userStepsProgress = { userId: null, step: 0, completed: false };
