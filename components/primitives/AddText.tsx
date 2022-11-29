import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import { FC } from "react";

const AddText: FC<{ onAdd?: Function; placeholder?: string }> = ({ onAdd, placeholder }) => {
  const [text, setText] = useState("");

  const onTextChangeHandler = (e) => {
    setText(e.target.value);
  };

  return (
    <Stack direction="row" spacing={2}>
      <TextField
        size="small"
        fullWidth
        value={text}
        placeholder={placeholder}
        onChange={onTextChangeHandler}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            onAdd({ text });
            setText("");
          }
        }}
      />
      <Fab
        sx={{ flexShrink: 0 }}
        size="small"
        disabled={text === ""}
        onClick={() => {
          onAdd({ text });
          setText("");
        }}
      >
        <AddIcon />
      </Fab>
    </Stack>
  );
};

export default AddText;
