import { Timestamp } from "firebase/firestore";
import _ from "lodash";
import { useRouter } from "next/router";

interface Data {
  [key: string]: any;
}

export const parseData = (data: Data) => {
  if (data.timeStamp) {
    data.timeStamp = timeStampToTime(data.timeStamp);
  }
  return data;
};

export const timeStampToTime = (timeStamp) => {
  return timeStamp.toDate().toString();
};

export const timeToTimeStamp = (time = { seconds: 0, nanoseconds: 0 }) => {
  return Timestamp.fromDate(new Date(time.seconds * 1000 + time.nanoseconds / 1000000));
};

export const useRefresh = () => {
  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath, undefined, { scroll: false });
  };

  return refreshData;
};
