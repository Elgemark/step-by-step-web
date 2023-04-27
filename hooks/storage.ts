import { useEffect, useState } from "react";
import _ from "lodash";

export const useLocalStorage = (id: string, path?: Array<string> | string, wait: boolean = false) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!wait) {
      restore();
    }

    return () => {
      save(data);
    };
  }, [wait]);

  const restore = () => {
    const localData: object = JSON.parse(localStorage.getItem(id));
    setData(_.get(localData, path));
    return localData;
  };

  const save = (data: object) => {
    const localData = JSON.parse(localStorage.getItem(id));
    const updatedData = { ...localData, ...data };
    localStorage.setItem(id, JSON.stringify(updatedData));
    return updatedData;
  };

  return { save, restore, data };
};
