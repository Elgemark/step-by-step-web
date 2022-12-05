import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import UserAvatar from "./UserAvatar";
import ProfileMoreMenu from "./ProfileMoreMenu";
import { useUser } from "../utils/firebase/api";
import { useState } from "react";
import { Button, Stack } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useSignOut } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { SyntheticEvent } from "react";

interface ProfileCardProps {
  onTabChange: (event: SyntheticEvent<Element, Event>, value: any) => void;
  tabValue: string;
}

const tabProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const ProfileCard = (props: ProfileCardProps) => {
  const [signOut, signOutLoading, signOutError] = useSignOut(getAuth());
  const [edit, setEdit] = useState(false);
  const { data: user, update, save: saveUser, isLoading } = useUser();
  const { tabValue, onTabChange } = props;

  const onEditHandler = () => {
    setEdit(true);
  };

  const onSignOutHandler = () => {
    signOut();
  };

  const onSaveHandler = () => {
    setEdit(false);
    saveUser();
  };

  const onChangeAliasHandler = (e) => {
    update("alias", e.target.value);
  };

  return (
    <Card {...props}>
      <CardHeader
        avatar={<UserAvatar />}
        action={<ProfileMoreMenu onEdit={onEditHandler} onSignOut={onSignOutHandler} />}
        title={
          edit ? <TextField fullWidth label="Alias" value={user?.alias} onChange={onChangeAliasHandler} /> : user?.alias
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of
          frozen peas along with the mussels, if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Stack style={{ width: "100%" }} direction={"column"}>
          <Stack direction={"row"} justifyContent={"right"}>
            {edit && <Button onClick={onSaveHandler}>Save</Button>}
          </Stack>
          <Tabs value={tabValue} onChange={onTabChange} aria-label="basic tabs example">
            <Tab label="Saved" {...tabProps(0)} value="saved" />
            <Tab label="Created" {...tabProps(1)} value="created" />
            <Tab label="Completed" {...tabProps(2)} value="completed" />
            <Tab label="Incompleted" {...tabProps(3)} value="incompleted" />
          </Tabs>
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
