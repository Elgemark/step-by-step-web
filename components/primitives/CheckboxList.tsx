import { useState, FC } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ListSubheader from "@mui/material/ListSubheader";

export type ListItemData = {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
};

const CheckboxList: FC<{ header?: string; data?: Array<ListItemData>; onChange: (id) => void }> = ({
  header,
  onChange,
  data = [],
}) => {
  return (
    <List dense>
      {header ? <ListSubheader>{header}</ListSubheader> : null}
      {data.map((itemData) => {
        const labelId = `checkbox-list-label-${itemData.id}`;

        return (
          <ListItem
            key={itemData.id}
            dense
            secondaryAction={
              <Checkbox
                sx={{ opacity: itemData.disabled ? 0.5 : 1 }}
                disabled={itemData.disabled}
                edge="start"
                onChange={() => onChange({ id: itemData.id, checked: itemData.checked })}
                checked={itemData.checked}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
          >
            <ListItemButton role={undefined} onClick={() => onChange(itemData.id)} disabled={itemData.disabled}>
              <ListItemText id={labelId} primary={itemData.label} sx={{ my: 0 }} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CheckboxList;
