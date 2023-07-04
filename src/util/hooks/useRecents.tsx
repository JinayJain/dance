import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { PlayerState, SavedPlayerState } from "../redux/slice/player";

const useRecents = () => {
  const [recents, setRecents] = useState<SavedPlayerState[]>([]);

  const media = useAppSelector((state) => state.player.media);
  const markers = useAppSelector((state) => state.player.markers);

  const getKey = (media: NonNullable<PlayerState["media"]>) => {
    if (media.source === "local" && media.title) {
      return media.title;
    }
    return media.url;
  };

  useEffect(() => {
    const playerStr = localStorage.getItem("player");
    const recentMap: Record<string, SavedPlayerState> = playerStr
      ? JSON.parse(playerStr)
      : {};
    const recentList = Object.values(recentMap);
    recentList.sort((a, b) => b.lastVisited - a.lastVisited);
    setRecents(recentList);
  }, []);

  useEffect(() => {
    if (media) {
      const playerStr = localStorage.getItem("player");
      const recentMap: Record<string, SavedPlayerState> = playerStr
        ? JSON.parse(playerStr)
        : {};

      const key = getKey(media);

      recentMap[key] = {
        ...media,
        markers,
        lastVisited: Date.now(),
      };

      localStorage.setItem("player", JSON.stringify(recentMap));

      console.log(recentMap[key]);
    }
  }, [markers, media]);

  const onClear = () => {
    localStorage.removeItem("player");
    setRecents([]);
  };

  return { recents, onClear };
};

export default useRecents;
