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
  let slugArray = _.flatten([post?.title.split(" "), [post?.category], post?.tags, [shortUUID()]]);
  slugArray = slugArray.map((fraction) => _.lowerCase(fraction));
  slugArray = _.compact(slugArray);
  slugArray = _.uniq(slugArray);
  slugArray = _.kebabCase(slugArray.join("-"));
  console.log({ slugArray });
  return slugArray;
};
