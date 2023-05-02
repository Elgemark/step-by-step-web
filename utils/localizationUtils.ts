import { useEffect, useState } from "react";
import { useUser } from "./firebase/api/user";
import _ from "lodash";

export type Texts = {
  [key: string]: any;
};

export const useGetLanguage = () => {
  const [language, setLanguage] = useState<string>("en-global");
  const { data: user } = useUser();

  useEffect(() => {
    setLanguage(user?.language || window?.navigator?.language || "en-global");
  }, [user?.language]);

  return language;
};

export const getText = (json: object, path: string, language: string = "en-global") => {
  return _.get(json, path + "." + language) || _.get(json, path + "." + "en-global");
};

export const useGetText = (texts: object, path: string) => {
  const language = useGetLanguage();
  const [text, setText] = useState("");
  useEffect(() => {
    setText(getText(texts, path, language));
  }, [language]);
  return text;
};

export const useGetTexts = (texts: object, paths: Array<string> = []) => {
  const language = useGetLanguage();
  const [_texts, setTexts] = useState<Texts>({});
  useEffect(() => {
    const newTexts = {};
    const keys = paths.length ? paths : _.keys(texts);
    keys.forEach((path) => {
      newTexts[path] = getText(texts, path, language);
      setTexts(newTexts);
    });
  }, [language, ...paths]);
  return {
    texts: _texts,
    getText: (path) => {
      return _.get(_texts, path);
    },
  };
};
