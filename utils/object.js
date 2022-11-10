import { useState } from "react";
import _ from "lodash";

export const useStateObject = (obj = {}) => {
  const [object, setObject] = useState(_.cloneDeep(obj));

  return {
    object,
    setValue: (path, value) => {
      const updatedObject = {};
      _.set(updatedObject, path, value);
      const mergedObject = _.merge(object, updatedObject);
      setObject(_.cloneDeep(mergedObject));
    },
    getValue: (path, defaultValue) => _.get(object, path) || defaultValue,
  };
};
