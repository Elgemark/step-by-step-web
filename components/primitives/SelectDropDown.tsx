import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { FC, ReactElement, ReactNode } from "react";

type Option = {
  label: string;
  value: string | number;
  element?: ReactNode | ReactElement;
};

type Options = Array<Option> | [];

const SelectDropDown: FC<{ onChange: Function; label: string; options: Options; value?: string }> = ({
  onChange,
  label,
  options = [],
  value = "",
  ...props
}) => {
  return (
    <FormControl sx={{ minWidth: 200 }} size="small" {...props}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={(e) => onChange(e.target.value)}>
        {options.map((option, index) => (
          <MenuItem key={`${option}-${index}`} value={option.value}>
            {option.element || null}
            {option.label || null}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectDropDown;
