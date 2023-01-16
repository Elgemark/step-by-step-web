import { FC, useState, ChangeEvent } from "react";
import styled from "styled-components";
import { TextFieldProps, Typography, TypographyProps } from "@mui/material";
import MUITextField from "@mui/material/TextField";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const TextField: FC<{
  value: string;
  onChange: any;
  maxLength?: number;
  multiline?: boolean;
  fullWidth?: boolean;
  rest?: TextFieldProps;
  maxLengthTextProps?: TypographyProps;
}> = ({ maxLength, maxLengthTextProps, value, multiline = false, fullWidth = false, onChange }) => {
  const [textValue, setTextValue] = useState(value);

  const onChangeHandler = (e) => {
    if (maxLength > 0 && e.currentTarget.value.length > maxLength) {
      return;
    }
    setTextValue(e.currentTarget.value);
    onChange(e);
  };

  return (
    <Root>
      <MUITextField fullWidth={fullWidth} multiline={multiline} value={textValue} onChange={onChangeHandler} />
      {maxLength > 0 && (
        <Typography variant="body2" {...maxLengthTextProps}>
          {`${textValue.length}/${maxLength}`}
        </Typography>
      )}
    </Root>
  );
};

export default TextField;
