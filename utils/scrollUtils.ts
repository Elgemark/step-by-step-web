import { useEffect, useState } from "react";

export const useScrolledToBottom = () => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    window.onscroll = function (ev) {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
    };
    // Clean up listener...
    return () => {
      window.onscroll = null;
    };
  }, []);

  return isBottom;
};
