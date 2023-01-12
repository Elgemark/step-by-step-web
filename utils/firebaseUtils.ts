import _ from "lodash";

interface Data {
  [key: string]: any;
}

export const parseData = (data: Data) => {
  if (data.timeStamp) {
    data.timeStamp = data.timeStamp.toDate().toString();
  }
  return data;
};
