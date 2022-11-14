import logoWhite from "../../assets/steps-logo-white.svg";

import Image from "next/image";

const StepsLogo = (props) => {
  return <Image src={logoWhite} {...props}></Image>;
};

export default StepsLogo;
