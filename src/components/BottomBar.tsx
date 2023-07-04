import {
  Box,
  ButtonGroup,
  Collapse,
  HStack,
  Input,
  RangeSlider,
  Select,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Stack,
  StackProps,
  Text,
  useBreakpointValue,
  VStack,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdFlip } from "react-icons/md";
import {
  SlCamera,
  SlControlPause,
  SlControlPlay,
  SlEqualizer,
  SlPin,
  SlRefresh,
  SlSizeActual,
  SlSizeFullscreen,
} from "react-icons/sl";
import useFullscreen from "../util/hooks/useFullscreen";
import useShortcut from "../util/hooks/useShortcut";
import { useAppDispatch, useAppSelector } from "../util/redux/hooks";
import {
  cameraToggled,
  loopChanged,
  loopToggled,
  markerAdded,
  markerRemoved,
  mirrorToggled,
  playToggled,
  progressChanged,
  speedChanged,
  speedDecreased,
  speedIncreased,
} from "../util/redux/slice/player";
import { toTimestamp } from "../util/time";
import ButtonBlock from "./ButtonBlock";
import { BarButton, BarIconButton } from "./Bar";
import { FiMinus, FiPlus } from "react-icons/fi";

const LoopPlayhead = () => {
  const progress = useAppSelector((state) => state.player.progress.time);

  return (
    <Box
      position="absolute"
      w="14px"
      h="14px"
      bg="whiteAlpha.300"
      borderWidth={1}
      borderColor="white"
      zIndex={1}
      borderRadius="full"
      left={`${progress * 100}%`}
      top="50%"
      transform="translate(-50%, -50%)"
    />
  );
};

const LoopProgress = () => {
  const loop = useAppSelector((state) => state.player.loop);

  const dispatch = useAppDispatch();

  if (!loop) {
    return null;
  }

  const start = loop.start;
  const end = loop.end;

  return (
    <RangeSlider
      flex={1}
      min={0}
      max={1}
      step={0.001}
      value={[start, end]}
      onChange={(value) =>
        dispatch(
          loopChanged({
            start: value[0],
            end: value[1],
          })
        )
      }
    >
      <RangeSliderTrack bg="whiteAlpha.300">
        <RangeSliderFilledTrack bg="gray.200" />
      </RangeSliderTrack>
      <RangeSliderThumb index={0} />
      <RangeSliderThumb index={1} />

      <LoopPlayhead />
    </RangeSlider>
  );
};

const ProgressBar = ({
  onSeek,
  ...props
}: { onSeek: (progress: number) => void } & StackProps) => {
  const [seekProgress, setSeekProgress] = useState<number>();
  const progress = useAppSelector((state) => state.player.progress.time);
  const duration = useAppSelector((state) => state.player.duration);
  const markers = useAppSelector((state) => state.player.markers);
  const playing = useAppSelector((state) => state.player.playing);
  const loop = useAppSelector((state) => state.player.loop);

  const dispatch = useAppDispatch();

  const visibleProgress = seekProgress ?? progress;

  const progressSeconds = visibleProgress * duration;
  return (
    <HStack flex={1} spacing={4} color="white" {...props}>
      <BarIconButton
        className="umami--click--player--play"
        aria-label={playing ? "Pause" : "Play"}
        icon={playing ? <SlControlPause /> : <SlControlPlay />}
        onClick={() => dispatch(playToggled())}
      />

      <Text>
        {toTimestamp(progressSeconds)}{" "}
        <Text as="span" color="gray.500">
          {" "}
          / {toTimestamp(duration)}
        </Text>
      </Text>
      {loop ? (
        <LoopProgress />
      ) : (
        <Slider
          flex={1}
          aria-label="player-progress"
          value={visibleProgress}
          onChange={(value) => setSeekProgress(value)}
          onChangeEnd={() => {
            console.log("seeking to", seekProgress);
            if (seekProgress !== undefined) {
              onSeek(seekProgress);
              setSeekProgress(undefined);
            }
          }}
          step={0.001}
          min={0}
          max={1}
          focusThumbOnChange={false}
        >
          <SliderTrack bg="whiteAlpha.300">
            <SliderFilledTrack bg="gray.200" />
          </SliderTrack>
          <SliderThumb />

          {markers.map((marker) => (
            <SliderMark key={marker.time} value={marker.time}>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                transform="translateX(-50%)"
                pt={2}
                zIndex={1}
                color="gray.400"
                _hover={{ color: "white", cursor: "pointer", zIndex: 1 }}
              >
                {marker.label}
              </Text>
            </SliderMark>
          ))}
        </Slider>
      )}
    </HStack>
  );
};

const Controls = () => {
  const speed = useAppSelector((state) => state.player.speed);
  const mirrored = useAppSelector((state) => state.player.mirrored);
  const showCamera = useAppSelector((state) => state.player.showCamera);
  const loop = useAppSelector((state) => state.player.loop);

  const showSmallSpeed = useBreakpointValue({ base: true, md: false });

  const dispatch = useAppDispatch();

  return (
    <HStack px={8} pt={4} justify="center" wrap="wrap" gap={4}>
      <HStack spacing={4}>
        <Text>Speed</Text>

        {showSmallSpeed ? (
          <HStack>
            <BarIconButton
              aria-label="Decrease Speed"
              onClick={() => dispatch(speedDecreased())}
              icon={<FiMinus />}
            />
            <Text>{speed.toFixed(2)}x</Text>
            <BarIconButton
              aria-label="Increase Speed"
              onClick={() => dispatch(speedIncreased())}
              icon={<FiPlus />}
            />
          </HStack>
        ) : (
          <ButtonBlock spacing={0}>
            {[0.25, 0.5, 0.75, 1, 1.25, 1.5].map((speedOption) => (
              <BarButton
                key={speedOption}
                active={speedOption === speed}
                aria-label={`Speed ${speedOption}x`}
                onClick={() => dispatch(speedChanged(speedOption))}
              >
                {speedOption}x
              </BarButton>
            ))}
          </ButtonBlock>
        )}
      </HStack>

      <BarButton
        className="umami--click--player--mirror"
        leftIcon={<MdFlip />}
        onClick={() => dispatch(mirrorToggled())}
        active={mirrored}
      >
        Mirror (R)
      </BarButton>

      <BarButton
        className="umami--click--player--camera"
        leftIcon={<SlCamera />}
        onClick={() => dispatch(cameraToggled())}
        active={showCamera}
      >
        See Yourself (S)
      </BarButton>

      <BarButton
        className="umami--click--player--loop"
        leftIcon={<SlRefresh />}
        onClick={() => dispatch(loopToggled())}
        active={!!loop}
      >
        Loop (L)
      </BarButton>
    </HStack>
  );
};

const Markers = () => {
  const progress = useAppSelector((state) => state.player.progress.time);
  const duration = useAppSelector((state) => state.player.duration);
  const markers = useAppSelector((state) => state.player.markers);

  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string>();

  return (
    <HStack justify="center" px={8} pt={4} gap={4} wrap="wrap" spacing={0}>
      <HStack maxW="xl" w="full">
        <Input
          placeholder="Marker Name"
          flex={1}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BarButton
          aria-label="Add Marker"
          leftIcon={<SlPin />}
          onClick={() => {
            dispatch(
              markerAdded({
                label: name || "Marker",
                time: progress,
              })
            );
            setName("");
          }}
        >
          Add Marker
        </BarButton>
      </HStack>

      <HStack maxW="xl" w="full" spacing={4}>
        <Select
          flex={1}
          placeholder="Remove Marker"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          {markers.map((marker) => (
            <option key={marker.id} value={marker.id}>
              {marker.label} ({toTimestamp(marker.time * duration)})
            </option>
          ))}
        </Select>

        <BarButton
          onClick={() => {
            if (selected !== undefined) {
              dispatch(markerRemoved(selected));
              setSelected(undefined);
            }
          }}
        >
          Delete
        </BarButton>
      </HStack>
    </HStack>
  );
};

const BottomBar = (props: StackProps) => {
  const dispatch = useAppDispatch();

  const [expanded, setExpanded] = useState<"controls" | "markers" | null>(null);

  const toggleExpanded = (section: "controls" | "markers") =>
    setExpanded((current) => (current === section ? null : section));
  const controlsOpen = expanded === "controls";
  const markersOpen = expanded === "markers";

  const { fullscreen, toggleFullscreen } = useFullscreen();

  useShortcut("c", () => toggleExpanded("controls"), { insensitive: true });
  useShortcut("m", () => toggleExpanded("markers"), { insensitive: true });

  return (
    <Stack spacing={0} {...props}>
      <Collapse in={controlsOpen}>
        <Controls />
      </Collapse>
      <Collapse in={markersOpen}>
        <Markers />
      </Collapse>
      <Stack
        p={[4, 4, 8]}
        spacing={[4, 4, 8]}
        wrap="wrap"
        direction={["column", "column", "row"]}
      >
        <ProgressBar
          onSeek={(time) =>
            dispatch(
              progressChanged({
                time,
                source: "change",
              })
            )
          }
        />

        <ButtonGroup alignSelf="center" spacing={4}>
          <BarIconButton
            aria-label="Controls (C)"
            icon={<SlEqualizer />}
            active={controlsOpen}
            onClick={() => toggleExpanded("controls")}
          />
          <BarIconButton
            aria-label={"Markers (M)"}
            icon={<SlPin />}
            active={markersOpen}
            onClick={() => toggleExpanded("markers")}
          />
          <BarIconButton
            aria-label={`${fullscreen ? "Exit " : ""}Fullscreen (F)`}
            icon={fullscreen ? <SlSizeActual /> : <SlSizeFullscreen />}
            onClick={toggleFullscreen}
          />
        </ButtonGroup>
      </Stack>
    </Stack>
  );
};

export default BottomBar;
