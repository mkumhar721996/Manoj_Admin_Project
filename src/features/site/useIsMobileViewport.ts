import { useEffect, useState } from "react";

const MOBILE_MAX_WIDTH = 640;

function computeIsMobile(): boolean {
  return window.innerWidth <= MOBILE_MAX_WIDTH;
}

export function useIsMobileViewport(): boolean {
  const [isMobile, setIsMobile] = useState(computeIsMobile);

  useEffect(() => {
    function handleResize() {
      setIsMobile(computeIsMobile());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}
