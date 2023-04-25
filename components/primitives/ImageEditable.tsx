import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import CropIcon from "@mui/icons-material/Crop";
import BrushIcon from "@mui/icons-material/Brush";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import { pasteHandler } from "../../utils/imageUtils";
import styled from "styled-components";
import OpenDialog from "./OpenDialog";
import { CircularProgress, Stack } from "@mui/material";
import { FC } from "react";
import Modal from "@mui/material/Modal";
import ImageEditor from "../ImageEditor";
import settings from "../../config";
import Dialog from "./Dialog";
import * as markerjs2 from "markerjs2";
import { useAnnotateLive } from "../../hooks/annotate";

const StyledCardMediaContainer = styled.div`
  position: relative !important;
  user-select: initial;
  width: 100%;
  min-height: 320px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover img,
  &:hover .annotate-overlay {
    opacity: ${({ hasImage }) => (hasImage ? 0.2 : 1)};
    transition: 0.2s opacity;
  }
  .actions-overlay {
    opacity: ${({ hasImage }) => (hasImage ? 0 : 1)};
    position: absolute;
  }
  &:hover .actions-overlay {
    opacity: 1;
  }

  .__markerjs2_ {
    position: fixed;
  }
`;

const StyledCardMedia = styled(CardMedia)`
  position: absolute;
  object-fit: cover;
`;

const StyledAnnotateView = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
  .__markerjslive_ {
    z-index: unset !important;
  }
  svg {
    pointer-events: none !important;
  }
`;

interface Media {
  imageURI?: String;
}

const ImageEditable: FC<{
  media: Media;
  annotation?: markerjs2.MarkerAreaState;
  onBlobChange: Function;
  onAnnotationChange?: Function;
  onDelete: Function;
}> = ({ media = { imageURI: "" }, annotation, onBlobChange, onDelete, onAnnotationChange, ...props }) => {
  const [showDeleteMediaDialog, setShowDeleteMediaDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [blob, setBlob] = useState();
  const [previewImageURI, setPreviewImageURI] = useState();
  const [selectedImageURI, setSelectedImageURI] = useState();
  const imgRef = useRef<HTMLImageElement>(null);
  const { ref: imgOverlayRef, update: updateAnnotateLive, state: annotateState } = useAnnotateLive(annotation);
  // Prevents typing in paste textField
  const [emptyrStr, setEmptyStr] = useState("");
  const [cropSettings, setCropSettings] = useState({ crop: { x: 0, y: 0 }, zoom: 1 });

  const hasImage = previewImageURI || selectedImageURI || media?.imageURI;

  useEffect(() => {
    if (blob) {
      onBlobChange(blob);
    }
  }, [blob]);

  const onPasteHandler = async (e) => {
    setIsLoading(true);
    try {
      const pasteResult = await pasteHandler(e);
      setSelectedImageURI(pasteResult.url);
      setPreviewImageURI(pasteResult.url);
      setBlob(pasteResult.blob);
      setIsLoading(false);
      setOpenEditor(true);
    } catch (error) {
      setIsLoading(false);
      setOpenEditor(false);
    }
  };

  const onFileSelectedHandler = ({ file, url }) => {
    setSelectedImageURI(url);
    setPreviewImageURI(url);
    setCropSettings({ crop: { x: 0, y: 0 }, zoom: 1 });
    setBlob(file);
    setOpenEditor(true);
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
    setBlob(imageBlob);
  };

  const onClickAnnotateHandler = () => {
    showPopMarkerArea();
  };

  const showPopMarkerArea = () => {
    if (imgRef.current !== null) {
      // create a marker.js MarkerArea
      const markerArea = new markerjs2.MarkerArea(imgRef.current);
      markerArea.renderImageType = "image/png";
      markerArea.renderMarkersOnly = true;
      markerArea.renderAtNaturalSize = true;
      markerArea.settings.displayMode = "popup";
      markerArea.styles.addRule({ selector: ".__markerjs2_ ", style: "position: fixed !important;" });
      markerArea.uiStyleSettings.zIndex = "99999";
      markerArea.uiStyleSettings.canvasBackgroundColor = "rgba(0,0,0,0)";

      // attach an event handler to assign annotated image back to our image element
      markerArea.addEventListener("render", (event) => {
        if (imgRef.current) {
          updateAnnotateLive(event.state);
          onAnnotationChange && onAnnotationChange(JSON.stringify(event.state));
        }
      });

      markerArea.show();
      // Close live view
      updateAnnotateLive();
      //restore
      if (annotateState) {
        markerArea.restoreState(annotateState);
      }
    }
  };

  return (
    <StyledCardMediaContainer onPaste={onPasteHandler} hasImage={hasImage} {...props} height={settings.image.height}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <StyledCardMedia
          className="card-media"
          component="img"
          image={previewImageURI || selectedImageURI || media?.imageURI}
          ref={imgRef}
        />
      )}
      <StyledAnnotateView ref={imgOverlayRef} className="annotate-overlay" />

      <Stack direction="row" className="actions-overlay" spacing={1}>
        <TextField
          size="small"
          className="paste"
          label="Paste image here..."
          value={emptyrStr}
          onChange={() => setEmptyStr("")}
          onPaste={onPasteHandler}
        />
        {/* BROWSE */}
        <OpenDialog onFileSelected={onFileSelectedHandler}>
          <IconButton className="select-file" aria-label="browse">
            <FolderOpenIcon />
          </IconButton>
        </OpenDialog>
        {/* CROP */}
        {selectedImageURI && (
          <IconButton className="button-edit-image" aria-label="edit" onClick={onClickEditHandler}>
            <CropIcon />
          </IconButton>
        )}
        {/* DELETE */}
        {previewImageURI || selectedImageURI || media?.imageURI ? (
          <IconButton aria-label="delete" onClick={() => setShowDeleteMediaDialog(true)}>
            <DeleteIcon />
          </IconButton>
        ) : null}
        {/* ANNOTATE */}
        {previewImageURI || selectedImageURI || media?.imageURI ? (
          <IconButton className="button-annotate-image" aria-label="annotate" onClick={onClickAnnotateHandler}>
            <BrushIcon />
          </IconButton>
        ) : null}
      </Stack>

      <Modal open={openEditor} onClose={onCloseEditorHandle}>
        <>
          <ImageEditor
            src={selectedImageURI}
            onDone={onCropDoneHandler}
            onClose={() => setOpenEditor(false)}
            settings={cropSettings}
          />
        </>
      </Modal>
      {/* DIALOG DELETE MEDIA */}
      <Dialog
        open={showDeleteMediaDialog}
        onClose={() => setShowDeleteMediaDialog(false)}
        onClickOk={() => {
          onDelete(media);
          setSelectedImageURI(null);
          setPreviewImageURI(null);
          setShowDeleteMediaDialog(false);
        }}
        onClickCancel={() => setShowDeleteMediaDialog(false)}
        content={"Delete image?"}
      />
    </StyledCardMediaContainer>
  );
};

export default ImageEditable;
