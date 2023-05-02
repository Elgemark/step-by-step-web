import { getAuth } from "firebase/auth";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useUser } from "./firebase/api/user";

export const toSanitizedArray = (str: string, tags = [], maxLength = 5) => {
  if (!str) {
    return [];
  }
  //
  let newTags = str.split(/,| |;|#|\+|\-/);
  // Removes leading and trailing whitespace
  newTags = newTags.map((tag: string) => _.trim(tag));
  // Removes empty strings
  newTags = newTags.filter((tag: string) => tag.length > 1);
  // Union with tags
  newTags = _.union(tags, newTags);
  // Trim to max length
  return newTags.slice(0, maxLength);
};

export const parseURL = (url) => {
  const urlArr = url.split("?");
  return { base: urlArr[0], query: urlArr[1] };
};

export const shortUUID = () => {
  // I generate the UID from two parts here
  // to ensure the random number provide enough bits.
  let firstPart = String((Math.random() * 46656) | 0);
  let secondPart = String((Math.random() * 46656) | 0);
  firstPart = ("000" + firstPart).slice(-3);
  secondPart = ("000" + secondPart).slice(-3);
  return firstPart + secondPart;
};

export const getText = (json: object, path: string, language: string) => {
  return _.get(json, path + "." + language) || _.get(json, path + "." + "en-global");
};

export const useGetText = (texts: object, path: string) => {
  const { data: user } = useUser();
  const [text, setText] = useState("");
  useEffect(() => {
    setText(getText(texts, path, user.language || window?.navigator?.language));
  }, [user.language]);
  return text;
};
