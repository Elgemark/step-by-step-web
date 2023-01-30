import _ from "lodash";
import { useRouter } from "next/router";

interface Data {
  [key: string]: any;
}

export const parseData = (data: Data) => {
  if (data.timeStamp) {
    data.timeStamp = data.timeStamp.toDate().toString();
  }
  return data;
};

export const useRefresh = () => {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath, undefined, { scroll: false });
  };

  return refreshData;
};
