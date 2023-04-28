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
import Dialog from "./Dialog";
import * as markerjs2 from "markerjs2";
import AnnotationEditor from "./AnnotationEditor";
import Annotation from "./Annotation";

const StyledCardMediaContainer = styled.div`
  position: relative !important;
  user-select: initial;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  .card-media {
    min-height: 100px;
    border: 0;
  }
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

interface Media {
  imageURI?: string;
}

const ImageEditable: FC<{
  media: Media;
  annotation?: markerjs2.MarkerAreaState;
  enableAnnotation?: boolean;
  onBlobChange: Function;
  onAnnotationChange?: Function;
  onDelete: Function;
}> = ({
  media = { imageURI: "" },
  annotation,
  onBlobChange,
  onDelete,
  onAnnotationChange,
  enableAnnotation = false,
  ...props
}) => {
  const [showAnnotationEditor, setShowAnnotationEditor] = useState(false);
  const [showDeleteMediaDialog, setShowDeleteMediaDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [blob, setBlob] = useState();
  const [previewImageURI, setPreviewImageURI] = useState();
  const [selectedImageURI, setSelectedImageURI] = useState();
  const imgRef = useRef<HTMLImageElement>(null);
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
    setShowAnnotationEditor(true);
  };

  const onAnnotationChangeHandler = (state) => {
    onAnnotationChange && onAnnotationChange(JSON.stringify(state));
  };

  return (
    <StyledCardMediaContainer onPaste={onPasteHandler} hasImage={hasImage} {...props}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <CardMedia
          className="card-media"
          component="img"
          width="100%"
          height="auto"
          image={previewImageURI || selectedImageURI || media?.imageURI}
          ref={imgRef}
        />
      )}
      <Annotation state={annotation} delay={500} />

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
        {enableAnnotation && (previewImageURI || selectedImageURI || media?.imageURI) ? (
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

      <AnnotationEditor
        state={annotation}
        onClose={() => setShowAnnotationEditor(false)}
        onChange={onAnnotationChangeHandler}
        open={showAnnotationEditor}
        src={previewImageURI || selectedImageURI || media?.imageURI}
      />
    </StyledCardMediaContainer>
  );
};

export default ImageEditable;
