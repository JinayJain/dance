import { MutableRefObject, useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";

/**
 * Many conditions checked to determine if the player should hide the controls.
 * - If the player is paused, the controls should be shown.
 * - If the user is hovering over a control, the controls should be shown.
 * - If there is no video loaded, the controls should be hidden. (TODO)
 * - If the user is moving the mouse within the player, the controls should be shown.
 * - Otherwise, after a timeout, the controls should be hidden.
 *
 */

const MOUSE_TIMEOUT = 500;
const CONTROLS_TIMEOUT = 3000;

const useShowControls = (
  ...controls: MutableRefObject<HTMLElement | null>[]
) => {
  const [hoverCount, setHoverCount] = useState(0);

  // add hover listeners to all controls
  useEffect(() => {
    const handleMouseEnter = () => setHoverCount((count) => count + 1);
    const handleMouseLeave = () => setHoverCount((count) => count - 1);

    controls.forEach((control) => {
      if (control.current) {
        control.current.addEventListener("mouseenter", handleMouseEnter);
        control.current.addEventListener("mouseleave", handleMouseLeave);
      }
    });
    return () => {
      controls.forEach((control) => {
        if (control.current) {
          control.current.removeEventListener("mouseenter", handleMouseEnter);
          control.current.removeEventListener("mouseleave", handleMouseLeave);
        }
      });
    };
  }, [controls]);

  const playing = useAppSelector((state) => state.player.playing);
  const url = useAppSelector((state) => state.player.media?.url); // TODO: Add url to controls checking
  const type = useAppSelector((state) => state.player.media?.type);

  const [mouseMoving, setMouseMoving] = useState(false);

  useEffect(() => {
    let timeout: number;

    const handleMouseMove = () => {
      setMouseMoving(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setMouseMoving(false), MOUSE_TIMEOUT);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const showControlsExpected =
    mouseMoving || !playing || hoverCount > 0 || !url || type === "audio";
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let timeout: number;

    if (showControlsExpected) {
      setShowControls(true);
    } else {
      timeout = setTimeout(() => setShowControls(false), CONTROLS_TIMEOUT);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showControlsExpected]);

  return showControls;
};

export default useShowControls;
