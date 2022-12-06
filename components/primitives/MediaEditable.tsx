import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
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

const StyledCardMediaContainer = styled.div`
  position: relative;
  user-select: initial;
  width: 100%;
  min-height: 300px;
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
  object-fit: contain;
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
  const [selectedImageURI, setSelectedImageURI] = useState();
  const { blob, imageURI: pasteImageURI, onPaste } = usePaste();
  const { upload, isLoading } = useUploadFileAsBlob(locationPath);
  const [emptyrStr, setEmptyStr] = useState("");

  const hasImage = selectedImageURI || pasteImageURI || media?.imageURI;

  useEffect(() => {
    if (blob) {
      setSelectedImageURI(null);
      // Upload
      upload(blob).then((e) => {
        onChangeImage(e.url);
      });
    }
  }, [blob]);

  const onFileSelectedHandler = ({ file, url }) => {
    setSelectedImageURI(url);
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

  return (
    <StyledCardMediaContainer onPaste={onPaste} hasImage={hasImage} {...props}>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <StyledCardMedia
            className="card-media"
            component="img"
            height="300"
            image={selectedImageURI || pasteImageURI || media?.imageURI}
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
            {hasImage && (
              <IconButton className="button-edit-image" aria-label="edit" onClick={onClickEditHandler}>
                <EditIcon />
              </IconButton>
            )}
          </Stack>
        </>
      )}
      <Modal open={openEditor} onClose={onCloseEditorHandle}>
        <ImageEditor src={selectedImageURI || pasteImageURI} />
      </Modal>
    </StyledCardMediaContainer>
  );
};

export default MediaEditable;
