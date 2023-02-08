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
};

const CheckboxList: FC<{ header?: string; data?: Array<ListItemData>; onChange: (id) => void }> = ({
  header,
  onChange,
  data = [],
}) => {
  const [checked, setChecked] = useState([0]);

  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

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
                edge="start"
                onChange={() => onChange(itemData.id)}
                checked={itemData.checked}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
          >
            <ListItemButton role={undefined} onClick={() => onChange(itemData.id)}>
              <ListItemText id={labelId} primary={itemData.label} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CheckboxList;
