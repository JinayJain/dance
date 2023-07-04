import { Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useRef } from "react";
import type ReactPlayer from "react-player";
import Bar from "../components/Bar";
import BottomBar from "../components/BottomBar";
import TopBar from "../components/TopBar";
import type { PlayerProps } from "../components/ResponsivePlayer";
import { useAppDispatch, useAppSelector } from "../util/redux/hooks";
import {
  controlsChanged,
  durationSet,
  paused,
  played,
  playToggled,
  progressChanged,
  titleChanged,
} from "../util/redux/slice/player";
import useFullscreen from "../util/hooks/useFullscreen";
import usePlayerShortcuts from "../util/hooks/usePlayerShortcuts";
import useShowControls from "../util/hooks/useControlTimeout";
import Camera from "../components/Camera";
import Status from "../components/Status";
import AudioIndicator from "../components/AudioIndicator";
import Recents from "../components/Recents";
import useRecents from "../util/hooks/useRecents";
import ResponsivePlayer from "../components/ResponsivePlayer";

const ForwardedResponsivePlayer = forwardRef<ReactPlayer, PlayerProps>(
  (props, ref) => {
    return <ResponsivePlayer playerRef={ref} {...props} />;
  }
);

ForwardedResponsivePlayer.displayName = "ForwardedResponsivePlayer";

const New = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  usePlayerShortcuts();

  const { recents, onClear: onClearRecents } = useRecents();

  const url = useAppSelector((state) => state.player.media?.url);
  const type = useAppSelector((state) => state.player.media?.type);
  const title = useAppSelector((state) => state.player.media?.title);
  const playing = useAppSelector((state) => state.player.playing);
  const speed = useAppSelector((state) => state.player.speed);
  const mirrored = useAppSelector((state) => state.player.mirrored);
  const progress = useAppSelector((state) => state.player.progress);
  const showCamera = useAppSelector((state) => state.player.showCamera);

  const isAudio = type === "audio";

  const dispatch = useAppDispatch();

  const { toggleFullscreen } = useFullscreen();

  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const showControls = useShowControls(topBarRef, bottomBarRef);

  useEffect(() => {
    dispatch(controlsChanged(showControls));
  }, [showControls, dispatch]);

  useEffect(() => {
    if (playerRef.current && progress.source === "change") {
      playerRef.current.seekTo(progress.time);
    }
  }, [progress]);

  useEffect(() => {
    // periodically check the player title
    if (!title) {
      const interval = setInterval(() => {
        if (playerRef.current) {
          const title: string | undefined =
            playerRef.current.getInternalPlayer()?.videoTitle;
          if (title) {
            dispatch(titleChanged(title));
          }
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dispatch, playerRef, title, url]);

  return (
    <Box
      ref={containerRef}
      position="relative"
      bg="gray.800"
      cursor={showControls ? "auto" : "none"}
      overflow="hidden"
    >
      <ForwardedResponsivePlayer
        ref={playerRef}
        containerProps={{
          onClick: () => dispatch(playToggled()),
          transform: mirrored ? "scaleX(-1)" : undefined,
          onDoubleClick: toggleFullscreen,
        }}
        playerProps={{
          playing,
          playbackRate: speed,
          url,
          onStart: () => console.log("onStart"),
          onPlay: () => dispatch(played()),
          onPause: () => dispatch(paused()),
          onBuffer: () => console.log("onBuffer"),
          onSeek: (e) => console.log("onSeek", e),
          onEnded: () => {
            console.log("onEnded");
            dispatch(progressChanged({ time: 1, source: "natural" }));
          },
          onProgress: (state) =>
            dispatch(
              progressChanged({ time: state.played, source: "natural" })
            ),
          onDuration: (duration) => dispatch(durationSet(duration)),
        }}
      />

      {!url && (
        <Recents
          recents={recents}
          onClear={onClearRecents}
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}

      {isAudio && (
        <AudioIndicator
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        />
      )}

      {showCamera && (
        <Camera position="absolute" color="white" container={containerRef} />
      )}

      <Box top={0} left={0} right={0} position="absolute">
        <Bar w="full" ref={topBarRef}>
          <TopBar />
        </Bar>
        <Status />
      </Box>

      <Bar
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        zIndex={1}
        ref={bottomBarRef}
      >
        <BottomBar />
      </Bar>
    </Box>
  );
};

export default New;
