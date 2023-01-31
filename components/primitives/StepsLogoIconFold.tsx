import logoIcon from "../../assets/steps-logo-icon-fold.svg";
import Image from "next/image";

const StepsLogoIconFold = (props) => {
  return <Image src={logoIcon} alt="steps-logo" {...props}></Image>;
};

export default StepsLogoIconFold;
