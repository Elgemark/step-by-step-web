import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Root = styled.div`
  z-index: -1;
  position: fixed;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1024px;
  height: 100%;
  overflow: hidden;
`;

const StyledIMG = styled.img`
  margin-top: -100px;
  margin-left: -20%;
  width: 140%;
  height: auto;
  opacity: ${({ isLoaded }) => (isLoaded ? 1 : 0)};
  transition: ${({ isLoaded }) => (isLoaded ? "1s opacity" : "0s opacity")};
`;

const Wallpaper = () => {
  const ref = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (ref.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  const onLoadHandler = () => {
    setIsLoaded(true);
  };

  console.log("isLoaded", isLoaded);
  return (
    <Root>
      <Container isLoaded={isLoaded} style={{ visibility: isLoaded ? "visible" : "hidden" }}>
        <StyledIMG ref={ref} isLoaded={isLoaded} onLoad={onLoadHandler} src="/images/steppo_bg.svg"></StyledIMG>
      </Container>
    </Root>
  );
};

export default Wallpaper;
