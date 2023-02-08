import { useState, FC } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import ListSubheader from "@mui/material/ListSubheader";

type ListItemData = {
  id: string;
  label: string;
  checked: boolean;
};

const CheckboxList: FC<{ header?: string }> = ({ header }) => {
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
      {[0, 1, 2, 3].map((value) => {
        const labelId = `checkbox-list-label-${value}`;

        return (
          <ListItem
            key={value}
            dense
            secondaryAction={
              <Checkbox
                edge="start"
                onChange={handleToggle(value)}
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": labelId }}
              />
            }
          >
            <ListItemButton role={undefined} onClick={handleToggle(value)}>
              <ListItemText id={labelId} primary={`Line item ${value + 1}`} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default CheckboxList;
