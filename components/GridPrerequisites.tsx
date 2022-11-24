import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/Inbox";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { Box, Fade, Grid, Input, Stack, TextField } from "@mui/material";

interface Item {
  text: string;
  quantity: string;
  unit: string;
}

const RemoveButton = ({ onClick }) => {
  return (
    <IconButton edge="end" aria-label="remove" onClick={onClick}>
      <RemoveIcon />
    </IconButton>
  );
};

const GridPrerequisites = ({ items = [], onRemove, editable = false }) => {
  if (items.length === 0) {
    return <></>;
  }

  return (
    // <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={4} sx={{ width: "100%" }}>
      {items.map((item: Item, index) => (
        <>
          <Grid xs={1}>
            <InboxIcon />
          </Grid>
          {/* TEXT */}
          <Grid xs={8}></Grid>
          {/* QUANTITY */}
          <Grid xs={1}>
            <Input placeholder="quantity" value={item.quantity} />
          </Grid>
          {/* UNIT */}
          <Grid xs={1}>
            <Input placeholder="unit" value={item.unit} />
          </Grid>
          {/* UNIT */}
          <Grid xs={1}>
            <RemoveButton />
          </Grid>
        </>
      ))}
    </Grid>
    // </Box>
  );
};

export default GridPrerequisites;
