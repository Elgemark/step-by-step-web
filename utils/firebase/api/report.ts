import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

export interface Report {
  code: number;
  body: number;
  comment: string;
  timeStamp?: any;
  userId?: string;
  postId?: string;
}

export interface ReportCode {
  code: number;
  body: string;
}

export interface ReportResponse {
  error: string | null;
  data: Report;
}

export interface ReportCodesResponse {
  error: string | null;
  codes: Array<ReportCode>;
}

export const getReportCodes = async () => {
  const response: ReportCodesResponse = { codes: [], error: null };
  const firebase = getFirestore();
  try {
    const docRef = doc(firebase, "config", "report");
    const docSnap = await getDoc(docRef);
    response.codes = docSnap.exists() ? docSnap.data().codes : [];
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const setReport = async (postId: string, userId: string, data: Report) => {
  const reportData: Report = { ...data, postId, userId, timeStamp: serverTimestamp() };
  const response: ReportResponse = { data: reportData, error: null };
  const firebase = getFirestore();
  try {
    const docRef = doc(firebase, "reports", postId, userId, uuid());
    await setDoc(docRef, reportData);
  } catch (error) {
    response.error = error;
  }
  return response;
};

export const useReport = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [codes, setCodes] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    getReportCodes().then((resp) => {
      setCodes(resp.codes);
      setIsLoading(false);
    });
  }, []);

  return { codes, isLoading };
};
