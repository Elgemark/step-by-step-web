import _ from "lodash";
import { shortUUID } from "./stringUtils";
export const getQuery = () => {
  return Object.fromEntries(new URLSearchParams(location.search));
};

export const getPath = () => {
  return location.href;
};

export const getBasePath = () => {
  return location.href.split("?")[0];
};

export const createSlug = (post: any) => {
  let slugArray = _.flatten([[post.category], post.title.split(" "), post.tags, [shortUUID()]]);
  slugArray = _.compact(slugArray);
  slugArray = _.uniq(slugArray);
  return _.kebabCase(slugArray.join("-"));
};
