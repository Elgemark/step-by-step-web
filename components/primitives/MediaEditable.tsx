import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import CropIcon from "@mui/icons-material/Crop";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { usePaste } from "../../utils/imageUtils";
import { useUploadFileAsBlob } from "../../utils/firebase/api";
import styled from "styled-components";
import OpenDialog from "./OpenDialog";
import { CircularProgress, Stack } from "@mui/material";
import { FC } from "react";
import Modal from "@mui/material/Modal";
import ImageEditor from "../ImageEditor";
import settings from "../../config";

const StyledCardMediaContainer = styled.div`
  position: relative;
  user-select: initial;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover img {
    opacity: ${({ hasImage }) => (hasImage ? 0.2 : 1)};
    transition: 0.2s opacity;
  }
  .actions-overlay {
    opacity: ${({ hasImage }) => (hasImage ? 0 : 1)};
  }
  &:hover .actions-overlay {
    opacity: 1;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  position: absolute;
  object-fit: cover;
`;

interface Media {
  imageURI?: String;
}

const MediaEditable: FC<{ locationPath: Array<string>; media: Media; onChangeImage?: Function }> = ({
  locationPath = [],
  media = { imageURI: "" },
  onChangeImage,
  ...props
}) => {
  const [openEditor, setOpenEditor] = useState(false);
  const [previewImageURI, setPreviewImageURI] = useState();
  const [selectedImageURI, setSelectedImageURI] = useState();

  const { blob, imageURI: pasteImageURI, onPaste } = usePaste();
  const { upload, isLoading } = useUploadFileAsBlob(locationPath);
  // Prevents typing in paste textField
  const [emptyrStr, setEmptyStr] = useState("");
  const [cropSettings, setCropSettings] = useState({ crop: { x: 0, y: 0 }, zoom: 1 });

  const hasImage = previewImageURI || selectedImageURI || media?.imageURI;

  useEffect(() => {
    if (blob) {
      // Upload
      upload(blob).then((e) => {
        onChangeImage(e.url);
      });
    }
  }, [blob]);

  useEffect(() => {
    if (pasteImageURI) {
      setSelectedImageURI(pasteImageURI);
      setPreviewImageURI(pasteImageURI);
      setCropSettings({ crop: { x: 0, y: 0 }, zoom: 1 });
      setOpenEditor(true);
    }
  }, [pasteImageURI]);

  const onFileSelectedHandler = ({ file, url }) => {
    setSelectedImageURI(url);
    setPreviewImageURI(url);
    setCropSettings({ crop: { x: 0, y: 0 }, zoom: 1 });
    setOpenEditor(true);
    // Upload
    upload(file)
      .then((e) => {
        onChangeImage(e.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onClickEditHandler = () => {
    setOpenEditor(true);
  };

  const onCloseEditorHandle = () => {
    setOpenEditor(false);
  };

  const onCropDoneHandler = ({ blob: imageBlob, url, settings }) => {
    setCropSettings(settings);
    setOpenEditor(false);
    setPreviewImageURI(url);
    // Upload
    upload(imageBlob)
      .then((e) => {
        onChangeImage(e.url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <StyledCardMediaContainer onPaste={onPaste} hasImage={hasImage} {...props} height={settings.image.height}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <StyledCardMedia
            className="card-media"
            component="img"
            image={previewImageURI || selectedImageURI || media?.imageURI}
          />

          <Stack direction="row" className="actions-overlay" spacing={1}>
            <TextField
              size="small"
              className="paste"
              label="Paste image here..."
              value={emptyrStr}
              onChange={() => setEmptyStr("")}
              onPaste={onPaste}
            />
            <OpenDialog onFileSelected={onFileSelectedHandler}>
              <IconButton className="select-file" aria-label="browse">
                <FolderOpenIcon />
              </IconButton>
            </OpenDialog>
            {selectedImageURI && (
              <IconButton className="button-edit-image" aria-label="edit" onClick={onClickEditHandler}>
                <CropIcon />
              </IconButton>
            )}
          </Stack>
        </>
      )}
      <Modal open={openEditor} onClose={onCloseEditorHandle}>
        <ImageEditor
          src={selectedImageURI}
          onDone={onCropDoneHandler}
          onClose={() => setOpenEditor(false)}
          settings={cropSettings}
        />
      </Modal>
    </StyledCardMediaContainer>
  );
};

export default MediaEditable;
