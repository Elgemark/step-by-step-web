import { useEffect, useState } from "react";

export const useScrolledToBottom = (margin = 0) => {
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    window.onscroll = function (ev) {
      if (window.innerHeight + window.scrollY + margin >= document.body.offsetHeight) {
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
