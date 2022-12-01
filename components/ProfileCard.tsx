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

interface ProfileCardProps {
  actions?: React.ReactNode;
}
const ProfileCard = (props: ProfileCardProps) => {
  const [edit, setEdit] = useState(false);
  const { user, update, save: saveUser, isLoading } = useUser();
  const { actions } = props;

  const onEditHandler = () => {};

  const onChangeAliasHandler = (e) => {
    update("alias", e.target.value);
  };

  return (
    <Card {...props}>
      <CardHeader
        avatar={<UserAvatar />}
        action={<ProfileMoreMenu onEdit={onEditHandler} />}
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
            <Button>Save</Button>
          </Stack>
          {actions}
        </Stack>
      </CardActions>
    </Card>
  );
};

export default ProfileCard;
