import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {useState} from "react"


export const useUploadImage = (locationPath = []) => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [complete, setComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState("");
  //
  const auth = getAuth();
  const userId = auth.currentUser.uid;

  const upload = async (uri) => {
    setComplete(false);
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662

    const blob:Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function (e) {
        resolve(xhr.response);
        setProgress(e.loaded / e.total);
      };
      xhr.onerror = function (e) {
        setError(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(getStorage(), "users", userId, ...locationPath, uuidv4());
    const _result = await uploadBytes(fileRef, blob);
    setResult(_result);

    const url = await getDownloadURL(fileRef);

    setComplete(true);
    setDownloadURL(url);

    return { downloadURL: url };
  };

  return { progress, complete, error, result, downloadURL, upload };
};

export const useUploadFileAsBlob = (locationPath = [], imageSize = "1024x1024") => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const upload = async (blob:Blob) => {
    setIsLoading(true);
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const pathArr = ["users", userId, ...locationPath].join("/");
    const fileRef = ref(getStorage(), pathArr);
    const _result = await uploadBytes(fileRef, blob);
    const receivedURL = await getDownloadURL(fileRef);
    const url = imageSize ? receivedURL.replace("?", `_${imageSize}?`) : receivedURL;
    // set results
    setResult(_result);
    setDownloadURL(url);
    setIsLoading(false);
    return { url: url, downloadURL: url };
  };

  return { upload, result, isLoading, downloadURL };
};
