import { useState, useEffect } from "react";

let prevScollY = 0;

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState(null);

  useEffect(() => {
    window.addEventListener("scroll", onScrollHandler);

    return () => {
      window.removeEventListener("scroll", onScrollHandler);
    };
  }, []);

  const onScrollHandler = (e) => {
    setScrollDirection(scrollY > prevScollY ? "down" : "up");
    prevScollY = window.scrollY;
  };

  return scrollDirection;
};
