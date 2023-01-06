import { FirebaseData } from "./firebase/interface";

export const parseData = (data: FirebaseData) => {
  if (data.serverTime) {
    data.serverTime = data.serverTime.toDate().toString();
  }
  return data;
};
