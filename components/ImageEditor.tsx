import { Box } from "@mui/material";
import styled from "styled-components";
import { FC, useCallback, useState } from "react";
import Slider from "@mui/material/Slider";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";

const Root = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background-color: "background.paper";
  border: 2px solid #fff;
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

// const style = {
//   position: "absolute" as "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   border: "2px solid #000",
//   boxShadow: 24,
//   p: 4,
// };

const ImageEditor: FC<{ src: string }> = ({ src }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedArea, croppedAreaPixels);
  }, []);

  return (
    <Root>
      <div className="crop-container">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          aspect={4 / 3}
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
      </div>
    </Root>
  );
};

export default ImageEditor;
