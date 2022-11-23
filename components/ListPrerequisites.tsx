import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";

const SecondaryAction = ({ onClick }) => {
  return (
    <IconButton edge="end" aria-label="remove" onClick={onClick}>
      <RemoveIcon />
    </IconButton>
  );
};

const ListPrerequisites = ({ prerequisites = [], onRemove }) => {
  return (
    <List>
      {prerequisites.map((prerequisite, index) => (
        <ListItem
          key={prerequisite}
          disablePadding
          secondaryAction={onRemove && <SecondaryAction onClick={() => onRemove({ index, prerequisite })} />}
        >
          <ListItemButton>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={prerequisite} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default ListPrerequisites;
