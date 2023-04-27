import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { useState } from "react";
import { UploadResponse } from "../interface";
import { ImageUploads } from "../type";

export const uploadImage = async (
  blob: Blob,
  imageSize: string = "1024x1024",
  locationPath: Array<string>,
  id?: string
) => {
  const response: UploadResponse = { error: null, url: null, id };
  try {
    const pathArr = locationPath.join("/");
    console.log("pathArr", pathArr);
    const fileRef = ref(getStorage(), pathArr);
    await uploadBytes(fileRef, blob);
    const receivedURL = await getDownloadURL(fileRef);
    response.url = imageSize ? receivedURL.replace("?", `_${imageSize}?`) : receivedURL;
  } catch (error) {
    response.error = error;
  }

  return response;
};

export const uploadImages = (uploadData: ImageUploads) => {
  const promises = [];
  uploadData.forEach((data) => {
    const promise = new Promise((resolve, reject) => {
      uploadImage(data.blob, data.imageSize, data.locationPath, data.id)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
    promises.push(promise);
  });

  return Promise.all(promises);
};

export const useUploadFileAsBlob = (locationPath = [], imageSize = "1024x1024") => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadURL, setDownloadURL] = useState("");

  const upload = async (blob: Blob) => {
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
