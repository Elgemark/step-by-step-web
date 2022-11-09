import { useState } from "react";

export const usePaste = () => {
  const [imageURI, setImageURI] = useState();
  const [file, setFile] = useState();
  const [blob, setBlob] = useState();
  const [isLoading, setIsLoading] = useState();

  const onPaste = (e) => {
    setIsLoading(true);
    if (e.clipboardData.files.length) {
      const fileObject = e.clipboardData.files[0];

      const file = {
        getRawFile: () => fileObject,
        name: fileObject.name,
        size: fileObject.size,
        status: 2,
        progress: 0,
      };
      setFile(file);
      console.log("file", file);
      var blob = file.getRawFile();
      setBlob(blob);
      var reader = new FileReader();
      reader.onload = (ev) => {
        setImageURI(ev.target.result);
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } else {
      alert("No image data was found in your clipboard. Copy an image first or take a screenshot.");
      setIsLoading(false);
    }
  };

  return { onPaste, imageURI, blob, file, isLoading };
};
