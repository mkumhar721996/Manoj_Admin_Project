import { useEffect, useState } from "react";

const MOBILE_MAX_WIDTH = 640;
const TABLET_MAX_WIDTH = 1024;

function computeColumns(): 1 | 2 | 4 {
  const width = window.innerWidth;
  if (width <= MOBILE_MAX_WIDTH) return 1;
  if (width <= TABLET_MAX_WIDTH) return 2;
  return 4;
}

export function useFeaturedGridColumns(): 1 | 2 | 4 {
  const [columns, setColumns] = useState(computeColumns);

  useEffect(() => {
    function handleResize() {
      setColumns(computeColumns());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return columns;
}
