import { useState } from "react";
import _ from "lodash";

export const useStateObject = (obj = {}) => {
  const [object, setObject] = useState(_.cloneDeep(obj));

  return {
    object,
    setValue: (path: Array<string | number> | string, value: any): object => {
      const updatedObject = _.cloneDeep(object);
      _.set(updatedObject, path, value);
      setObject(updatedObject);
      return updatedObject;
    },
    replace: (object: object): object => {
      setObject(object);
      return object;
    },
    getValue: (path: Array<string | number> | string, defaultValue?: any): any => _.get(object, path) || defaultValue,
  };
};
