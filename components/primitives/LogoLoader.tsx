import { CircularProgress } from "@mui/material";
import styled from "styled-components";

const CubeRoot = styled.div`
  position: absolute;
  width: ${({ size }) => size + "px"};
  height: ${({ size }) => size + "px"};
  transform-style: preserve-3d;
  animation: spin 4s linear infinite;

  .face {
    perspective: 500px;
    position: absolute;
    width: ${({ size }) => size + "px"};
    height: ${({ size }) => size + "px"};
    /* box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5); */
    /* background: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0)); */
    background: ${({ color }) => color};
  }

  .front {
    transform: translateZ(${({ size }) => size * 0.5 + size * 0.5 + "px"});
  }
  .back {
    transform: translateZ(${({ size }) => size * -0.5 - size * 0.5 + "px"}) rotateY(180deg);
  }
  .left {
    transform: translateX(${({ size }) => size * -0.5 - size * 0.5 + "px"}) rotateY(-90deg);
  }
  .right {
    transform: translateX(${({ size }) => size * 0.5 + size * 0.5 + "px"}) rotateY(90deg);
  }
  .top {
    transform: translateY(${({ size }) => size * -0.5 - size * 0.5 + "px"}) rotateX(90deg);
  }
  .bottom {
    transform: translateY(${({ size }) => size * 0.5 + size * 0.5 + "px"}) rotateX(-90deg);
  }

  @keyframes spin {
    from {
      transform: rotateY(0) rotateZ(0);
    }
    to {
      transform: rotateY(360deg) rotateZ(360deg);
    }
  }
`;

const LoaderContainer = styled.div`
  .cube-orange {
    margin: 12.5px;
  }
`;

const Root = styled.div`
  display: flex;
  .logo {
    margin-right: 20px;
    animation: pulse 1s linear infinite;
    animation-direction: alternate;
  }

  @keyframes pulse {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }
`;

const Cube = ({ size = 50, color = "#2277ff", ...rest }) => {
  return (
    <CubeRoot size={size} color={color} {...rest}>
      <div className="face front"></div>
      <div className="face back"></div>
      <div className="face left"></div>
      <div className="face right"></div>
      <div className="face top"></div>
      <div className="face bottom"></div>
    </CubeRoot>
  );
};

const LogoLoader = () => {
  return (
    <Root>
      <CircularProgress />
    </Root>
  );
};

export default LogoLoader;
