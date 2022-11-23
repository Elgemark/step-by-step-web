import _ from "lodash";

export const toSanitizedArray = (str: string, tags = [], maxLength = 5) => {
  if (!str) {
    return [];
  }
  //
  let newTags = str.split(/,| |;|\+|\-/);
  // Removes leading and trailing whitespace
  newTags = newTags.map((tag: string) => _.trim(tag));
  // Removes empty strings
  newTags = newTags.filter((tag: string) => tag.length > 1);
  // Union with tags
  newTags = _.union(tags, newTags);
  // Trim to max length
  return newTags.slice(0, maxLength);
};
