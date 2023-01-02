import { Box, Button } from "@mui/material";
import styled from "styled-components";
import { FC, useCallback, useState } from "react";
import Slider from "@mui/material/Slider";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { generateBlob } from "../utils/imageUtils";
import IconButton from "@mui/material/IconButton";
import CancelIcon from "@mui/icons-material/Cancel";
import appSettings from "../config";

const Root = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border: 2px solid #fff;
  .button-close {
    position: absolute;
    top: 0;
    right: 0;
  }
  .crop-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 80px;
  }

  .controls {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 50%;
    transform: translateX(-50%);
    height: 80px;
    display: flex;
    align-items: center;
  }

  .slider {
    padding: 22px 0px;
  }
`;

export interface CropSetting {
  crop: Point;
  zoom: number;
  aspect?: number;
}

const ImageEditor: FC<{
  src: string;
  settings?: CropSetting;
  onDone: Function;
  onClose: React.MouseEventHandler<HTMLElement>;
}> = ({ src, settings = { crop: { x: 0, y: 0 }, zoom: 1 }, onDone, onClose }) => {
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState<Point>(settings.crop);
  const [zoom, setZoom] = useState<number>(settings.zoom);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const onDoneHandler = async () => {
    try {
      const { blob, url } = await generateBlob(src, croppedArea);
      onDone({ blob, url, settings: { crop, zoom } });
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Root>
      <div className="crop-container">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={settings.aspect || appSettings.image.aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className="controls">
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          aria-labelledby="Zoom"
          onChange={(e, zoom) => setZoom(Number(zoom))}
          classes={{ root: "slider" }}
        />

        <Button onClick={onDoneHandler}>Done</Button>
      </div>
      <IconButton className="button-close" onClick={onClose}>
        <CancelIcon />
      </IconButton>
    </Root>
  );
};

export default ImageEditor;
