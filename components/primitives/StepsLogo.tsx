import logoWhite from "../../assets/steps-logo-white.svg";
import logoBlack from "../../assets/steps-logo-black.svg";

import Image from "next/image";
import { useTheme } from "@mui/material";

const StepsLogo = (props) => {
  const theme = useTheme();
  if (theme.palette.mode === "dark") {
    return <Image src={logoWhite} alt="steps-logo" {...props}></Image>;
  } else {
    return <Image src={logoBlack} alt="steps-logo" {...props}></Image>;
  }
};

export default StepsLogo;
