import { useMediaQuery } from "@chakra-ui/react";

// detects mobile based on screen dimensions and orientation
const useMobile = () =>
  useMediaQuery([
    "(max-width: 768px) and (orientation: portrait)",
    "(max-width: 1024px) and (orientation: landscape)",
  ]).some((isMobile) => isMobile);

export default useMobile;
