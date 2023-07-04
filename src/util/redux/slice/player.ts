import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MAX_SPEED, MIN_SPEED } from "../../constants";

export type MediaType = "video" | "audio" | "unset";
export type MediaSource = "youtube" | "local";
export interface Marker {
  id: string;
  time: number;
  label: string;
}

type Progress = {
  time: number;
  source: "natural" | "change";
};

export interface PlayerState {
  media: {
    title?: string;
    url: string;
    type: MediaType;
    source: MediaSource;
  } | null;
  playing: boolean;
  volume: number;
  progress: Progress;
  duration: number;
  speed: number;
  mirrored: boolean;
  showCamera: boolean;
  controls: boolean;
  markers: Marker[];
  loop?: {
    start: number;
    end: number;
  };
}

const initialState: PlayerState = {
  media: null,
  playing: false,
  volume: 1,
  progress: {
    time: 0,
    source: "change",
  },
  duration: 0,
  speed: 1,
  mirrored: false,
  showCamera: false,
  controls: true,
  markers: [],
  loop: undefined,
};

type LoadPayload = {
  title?: string;
  url: string;
  type: MediaType;
  source: MediaSource;
  markers?: Marker[];
};

export type SavedPlayerState = {
  lastVisited: number;
} & LoadPayload;

const constrain = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    loaded: (_, action: PayloadAction<LoadPayload>) => {
      const newState: PlayerState = {
        ...initialState,
        media: {
          title: action.payload.title,
          url: action.payload.url,
          type: action.payload.type,
          source: action.payload.source,
        },
        markers: action.payload.markers || [],
      };

      return newState;
    },
    titleChanged: (state, action: PayloadAction<string>) => {
      if (state.media) {
        state.media.title = action.payload;
      }
    },
    played: (state) => {
      state.playing = true;
    },
    paused: (state) => {
      state.playing = false;
    },
    playToggled: (state) => {
      state.playing = !state.playing;
    },
    mirrorToggled: (state) => {
      state.mirrored = !state.mirrored;
    },
    cameraToggled: (state) => {
      state.showCamera = !state.showCamera;
    },
    controlsChanged: (state, action: PayloadAction<boolean>) => {
      state.controls = action.payload;
    },
    progressChanged: (state, action: PayloadAction<Progress>) => {
      if (state.loop) {
        const { start, end } = state.loop;
        const { time } = action.payload;
        if (time < start || time > end) {
          state.progress.time = start;
          state.progress.source = "change";
        } else {
          state.progress = action.payload;
        }
      } else {
        state.progress = {
          time: constrain(action.payload.time, 0, 1),
          source: action.payload.source,
        };
      }
    },
    secondsDeltaChanged: (state, action: PayloadAction<Progress>) => {
      let delta = action.payload.time / state.duration;
      state.progress = {
        time: constrain(state.progress.time + delta, 0, 1),
        source: action.payload.source,
      };
    },
    volumeChanged: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    durationSet: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    speedChanged: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    speedIncreased: (state) => {
      state.speed = constrain(state.speed + 0.25, MIN_SPEED, MAX_SPEED);
    },
    speedDecreased: (state) => {
      state.speed = constrain(state.speed - 0.25, MIN_SPEED, MAX_SPEED);
    },
    markerAdded: (state, action: PayloadAction<Omit<Marker, "id">>) => {
      const id = Math.random().toString(36).slice(2, 9);
      state.markers.push({ ...action.payload, id });
      state.markers.sort((a, b) => a.time - b.time);
    },
    markerRemoved: (state, action: PayloadAction<string>) => {
      state.markers = state.markers.filter(
        (marker) => marker.id !== action.payload
      );
    },
    loopToggled: (state) => {
      const start = state.progress.time;
      const end = constrain(start + 0.05, 0, 1);
      state.loop = state.loop ? undefined : { start, end };
    },
    loopChanged: (
      state,
      action: PayloadAction<{ start: number; end: number }>
    ) => {
      if (state.loop) {
        console.log(state.loop.start, state.loop.end);
        state.loop.start = action.payload.start;
        state.loop.end = action.payload.end;
      }
    },
  },
});

export const {
  cameraToggled,
  controlsChanged,
  durationSet,
  loaded,
  loopChanged,
  loopToggled,
  markerAdded,
  markerRemoved,
  mirrorToggled,
  paused,
  playToggled,
  played,
  progressChanged,
  secondsDeltaChanged,
  speedChanged,
  speedDecreased,
  speedIncreased,
  titleChanged,
  volumeChanged,
} = playerSlice.actions;

export default playerSlice.reducer;
