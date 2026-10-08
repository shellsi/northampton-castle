"use client";

import { create } from "zustand";
import {
  eraById,
  moodFor,
  overviewCamera,
  tours,
  type EraId,
  type Mood,
  type Vec3,
} from "@/content/site";

type CameraShot = { position: Vec3; target: Vec3 };

type CastleState = {
  eraId: EraId;
  evidence: boolean;
  compareOn: boolean;
  compare: number;
  selectedId: string | null;
  tourId: string | null;
  beatIndex: number;
  playing: boolean;
  intro: boolean;
  keepSite: "nw" | "ne";
  mood: Mood | null;
  cutaway: boolean;
  camera: CameraShot;
  cameraNonce: number;
  setEra: (id: EraId) => void;
  toggleEvidence: () => void;
  setCompareOn: (on: boolean) => void;
  setCompare: (value: number) => void;
  select: (id: string | null) => void;
  startTour: (id: string) => void;
  exitTour: () => void;
  nextBeat: () => void;
  prevBeat: () => void;
  setPlaying: (playing: boolean) => void;
  dismissIntro: () => void;
  setKeepSite: (site: "nw" | "ne") => void;
  resetCamera: () => void;
};

function beatPatch(tourId: string, index: number, nonce: number) {
  const tour = tours.find((item) => item.id === tourId);
  const beat = tour?.beats[index];
  if (!tour || !beat) return {};
  return {
    tourId,
    beatIndex: index,
    eraId: beat.eraId,
    mood: beat.mood ?? null,
    cutaway: Boolean(beat.cutaway),
    camera: { position: beat.position, target: beat.target },
    cameraNonce: nonce,
    selectedId: null,
    compareOn: false,
    intro: false,
  };
}

export const useCastle = create<CastleState>((set, get) => ({
  eraId: "peak",
  evidence: false,
  compareOn: false,
  compare: 55,
  selectedId: null,
  tourId: null,
  beatIndex: 0,
  playing: false,
  intro: true,
  keepSite: "nw",
  mood: null,
  cutaway: false,
  camera: overviewCamera,
  cameraNonce: 0,
  setEra: (id) =>
    set({
      eraId: id,
      tourId: null,
      playing: false,
      mood: null,
      cutaway: false,
      selectedId: null,
    }),
  toggleEvidence: () => set((state) => ({ evidence: !state.evidence })),
  setCompareOn: (on) => set({ compareOn: on }),
  setCompare: (value) => set({ compare: value }),
  select: (id) => set({ selectedId: id }),
  startTour: (id) => {
    const tour = tours.find((item) => item.id === id);
    if (!tour) return;
    set(beatPatch(id, 0, get().cameraNonce + 1));
    set({ playing: true });
  },
  exitTour: () => set({ tourId: null, playing: false, mood: null, cutaway: false }),
  nextBeat: () => {
    const { tourId, beatIndex } = get();
    if (!tourId) return;
    const tour = tours.find((item) => item.id === tourId);
    if (!tour) return;
    if (beatIndex >= tour.beats.length - 1) {
      set({ playing: false });
      return;
    }
    set(beatPatch(tourId, beatIndex + 1, get().cameraNonce + 1));
  },
  prevBeat: () => {
    const { tourId, beatIndex } = get();
    if (!tourId || beatIndex === 0) return;
    set({ ...beatPatch(tourId, beatIndex - 1, get().cameraNonce + 1), playing: false });
  },
  setPlaying: (playing) => set({ playing }),
  dismissIntro: () => set({ intro: false }),
  setKeepSite: (site) => set({ keepSite: site }),
  resetCamera: () => {
    const { eraId, cameraNonce } = get();
    const era = eraById(eraId);
    set({
      camera: overviewCamera,
      cameraNonce: cameraNonce + 1,
      mood: moodFor(era.id) === "day" ? null : null,
      tourId: null,
      playing: false,
      cutaway: false,
    });
  },
}));
