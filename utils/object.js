import { useState } from "react";
import _ from "lodash";

export const useStateObject = (obj = {}) => {
  const [object, setObject] = useState(_.cloneDeep(obj));

  return {
    object,
    setValue: (path, value) => {
      const updatedObject = _.cloneDeep(object);
      _.set(updatedObject, path, value);
      setObject(updatedObject);
    },
    replace: (object) => {
      setObject(object);
    },
    getValue: (path, defaultValue) => _.get(object, path) || defaultValue,
  };
};
