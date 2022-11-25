import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { Fade, Input, Stack } from "@mui/material";

interface Item {
  text: string;
  quantity: string;
  unit: string;
}

const SecondaryAction = ({ onClick }) => {
  return (
    <IconButton edge="end" aria-label="remove" onClick={onClick}>
      <RemoveIcon />
    </IconButton>
  );
};

const ListPrerequisites = ({ items = [], onRemove, editable = false }) => {
  if (items.length === 0) {
    return <></>;
  }

  return (
    <List>
      {items.map((item: Item, index) => (
        <Fade in={true}>
          <ListItem
            key={item}
            disablePadding
            secondaryAction={
              editable && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <ListItemText
                    primary={
                      <Input size="small" placeholder="quantity" sx={{ width: "60px" }} inputProps={{ maxLength: 6 }} />
                    }
                  />
                  <ListItemText
                    primary={
                      <Input size="small" placeholder="unit" sx={{ width: "60px" }} inputProps={{ maxLength: 6 }} />
                    }
                  />
                  <SecondaryAction onClick={() => onRemove({ index, item })} />
                </Stack>
              )
            }
          >
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={item.text} sx={{ flexGrow: 1 }} />
          </ListItem>
        </Fade>
      ))}
    </List>
  );
};

export default ListPrerequisites;
