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
  value?: string;
  onChange?: any;
  className?: string;
  label?: string;
  variant?: "standard" | "outlined" | "filled";
  maxLength?: number;
  multiline?: boolean;
  fullWidth?: boolean;
  rest?: TextFieldProps;
  maxLengthTextProps?: TypographyProps;
  [key: string]: any;
}> = ({
  maxLength,
  maxLengthTextProps,
  value = "",
  label,
  className,
  multiline = false,
  variant = "outlined",
  fullWidth = false,
  onChange,
  ...rest
}) => {
  // const [textValue, setTextValue] = useState(value);

  const onChangeHandler = (e) => {
    if (maxLength > 0 && e.currentTarget.value.length > maxLength) {
      return;
    }
    onChange(e);
  };

  return (
    <Root>
      <MUITextField
        {...rest}
        value={value}
        className={className}
        variant={variant}
        fullWidth={fullWidth}
        multiline={multiline}
        label={label}
        onChange={onChangeHandler}
      />
      {maxLength > 0 && (
        <Typography variant="body2" {...maxLengthTextProps}>
          {`${value.length}/${maxLength}`}
        </Typography>
      )}
    </Root>
  );
};

export default TextField;
