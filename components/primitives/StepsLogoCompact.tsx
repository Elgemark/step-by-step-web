import logoBlue from "../../assets/steps-logo-compact-blue.svg";
import Image from "next/image";
import { useTheme } from "@mui/material";

const StepsLogoCompact = (props) => {
  const theme = useTheme();
  if (theme.palette.mode === "dark") {
    return <Image src={logoBlue} alt="steps-logo" {...props}></Image>;
  } else {
    return <Image src={logoBlue} alt="steps-logo" {...props}></Image>;
  }
};

export default StepsLogoCompact;
