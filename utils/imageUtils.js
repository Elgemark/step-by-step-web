import { useState } from "react";

export const usePaste = () => {
  const [imageURI, setImageURI] = useState();
  const [file, setFile] = useState();
  const [blob, setBlob] = useState();
  const [result, setResult] = useState();
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
      var blob = file.getRawFile();
      setBlob(blob);
      var reader = new FileReader();
      reader.onloadend = (ev) => {
        setResult(ev.target.result);
        setImageURI(ev.target.result);
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } else {
      alert("No image data was found in your clipboard. Copy an image first or take a screenshot.");
      setIsLoading(false);
    }
  };

  return { onPaste, imageURI, blob, result, file, isLoading };
};

/**
 * This function was adapted from the one in the ReadMe of https://github.com/DominicTobias/react-image-crop
 * @param {File} imageSrc - Image File url
 * @param {Object} pixelCrop - pixelCrop Object provided by react-easy-crop
 * @param {number} rotation - optional rotation parameter
 */

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // needed to avoid cross-origin issues on CodeSandbox
    image.src = url;
  });

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

export default async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  // set each dimensions to double largest dimension to allow for a safe area for the
  // image to rotate in without being clipped by canvas context
  canvas.width = safeArea;
  canvas.height = safeArea;

  // translate canvas context to a central location on image to allow rotating around the center.
  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);

  // draw rotated image and store data.
  ctx.drawImage(image, safeArea / 2 - image.width * 0.5, safeArea / 2 - image.height * 0.5);

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // set canvas width to final desired crop size - this will clear existing context
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // paste generated rotate image with correct offsets for x,y crop values.
  ctx.putImageData(
    data,
    0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
    0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
  );

  // As Base64 string
  // return canvas.toDataURL("image/jpeg");
  return canvas;
}

export const generateBlob = async (imageSrc, crop) => {
  const canvas = await getCroppedImg(imageSrc, crop);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const url = URL.createObjectURL(blob);
  return { blob, url };
};
