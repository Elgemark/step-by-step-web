import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

const AddText = ({ onAdd, placeholder, disabled, children }) => {
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
      {children}
      <Fab
        sx={{ flexShrink: 0 }}
        size="small"
        disabled={disabled}
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
