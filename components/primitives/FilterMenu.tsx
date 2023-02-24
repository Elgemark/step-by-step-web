import { Chip, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { FC } from "react";

const FilterMenu: FC<{
  onClick?: Function;
  values: Array<string> | Array<{ value: string; label: string }>;
  selectedValue: string;
}> = ({ onClick, values, selectedValue }) => {
  return (
    <Stack direction={"row"} spacing={1} sx={{ marginBottom: 1 }} alignItems="center">
      <FilterListIcon></FilterListIcon>
      {values.map((value) => (
        <Chip
          label={value?.label || value}
          variant={(value?.value || value) === selectedValue ? "filled" : "outlined"}
          clickable={Boolean(onClick)}
          onClick={() => onClick && onClick({ value: value?.value || value })}
        />
      ))}
    </Stack>
  );
};

export default FilterMenu;
