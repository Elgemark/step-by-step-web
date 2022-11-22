import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const StepsProgress = ({ label, value, propsProgress, ...props }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Box sx={{ maxWidth: 140, width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" value={value} {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="bod2" color="text.secondary">{`${label}`}</Typography>
      </Box>
    </Box>
  );
};

export default StepsProgress;
