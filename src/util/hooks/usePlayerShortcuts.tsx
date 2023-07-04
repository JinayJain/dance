import { useAppDispatch } from "../redux/hooks";
import {
  playToggled,
  secondsDeltaChanged,
  mirrorToggled,
  cameraToggled,
  speedIncreased,
  speedDecreased,
  loopToggled,
} from "../redux/slice/player";
import useFullscreen from "./useFullscreen";
import useShortcut from "./useShortcut";

const usePlayerShortcuts = () => {
  const dispatch = useAppDispatch();
  const { toggleFullscreen } = useFullscreen();

  useShortcut(" ", () => dispatch(playToggled()), { noButton: true });
  useShortcut("ArrowLeft", () =>
    dispatch(secondsDeltaChanged({ time: -5, source: "change" }))
  );
  useShortcut("ArrowRight", () =>
    dispatch(secondsDeltaChanged({ time: 5, source: "change" }))
  );
  useShortcut("ArrowUp", () => dispatch(speedIncreased()));
  useShortcut("ArrowDown", () => dispatch(speedDecreased()));
  useShortcut("f", toggleFullscreen, { insensitive: true });
  useShortcut("r", () => dispatch(mirrorToggled()), { insensitive: true });
  useShortcut("s", () => dispatch(cameraToggled()), { insensitive: true });
  useShortcut("l", () => dispatch(loopToggled()), { insensitive: true });
};

export default usePlayerShortcuts;
