import logoBlue from "../../assets/steps-logo-blue.svg";
import logoBlack from "../../assets/steps-logo-black.svg";

import Image from "next/image";
import { useTheme } from "@mui/material";

const StepsLogo = (props) => {
  const theme = useTheme();
  if (theme.palette.mode === "dark") {
    return <Image src={logoBlue} alt="steps-logo" {...props}></Image>;
  } else {
    return <Image src={logoBlack} alt="steps-logo" {...props}></Image>;
  }
};

export default StepsLogo;
