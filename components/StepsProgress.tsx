import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box, { BoxTypeMap } from "@mui/material/Box";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { FC } from "react";
import styled from "styled-components";
import { Grow } from "@mui/material";
import IconSteppoCheckColor from "./primitives/IconCheck";

const Root = styled(Box)`
  position: relative;
  .icon-done {
    margin-top: 3px;
  }
  .label {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    @media (min-width: 700px) {
      padding-left: 42px;
    }
  }
  span {
    font-weight: bold;
    font-size: large;
  }

  .progress-bar-container {
    width: 100%;
    max-width: 540px;
    @media (min-width: 700px) {
      padding-left: 42px;
    }
  }
  .MuiLinearProgress-root {
    height: 32px;
    border-radius: 16px;
    background-color: rgba(255, 255, 255, 0.1);
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
      <Box className="progress-bar-container" {...propsProgress}>
        <LinearProgress variant="determinate" color="primary" value={Math.max(0, value)} />
        <Box className="label">
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
      </Box>
    </Root>
  );
};

export default StepsProgress;
