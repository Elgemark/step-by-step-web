import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box, { BoxTypeMap } from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { FC } from "react";
import styled from "styled-components";
import { Grow } from "@mui/material";
import IconSteppoCheckColor from "./primitives/IconSteppoCheckColor";

const Root = styled(Box)`
  .icon-done {
    margin-top: 3px;
  }
`;

const StepsProgress: FC<{ label: string; complete: boolean; value: number; propsProgress?: BoxTypeMap }> = ({
  label,
  value,
  propsProgress,
  complete = false,
  ...props
}) => {
  return (
    <Root sx={{ display: "flex", alignItems: "center", justifyContent: "center" }} {...props}>
      <Box sx={{ maxWidth: 140, width: "100%", mr: 1 }} {...propsProgress}>
        <LinearProgress variant="determinate" color="primary" value={Math.max(0, value)} {...propsProgress} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        {complete ? (
          <Grow in={true}>
            <div>
              <IconSteppoCheckColor className="icon-done" />
            </div>
          </Grow>
        ) : (
          <Typography variant="button" color="text.secondary">{`${label}`}</Typography>
        )}
      </Box>
    </Root>
  );
};

export default StepsProgress;
