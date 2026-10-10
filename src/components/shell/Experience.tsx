"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Eye,
  Info,
  MapPin,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  confidenceMeta,
  eraById,
  eras,
  hotspotById,
  hotspots,
  tours,
  type EraId,
} from "@/content/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCastle } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Fallback } from "@/components/shell/Fallback";

const CastleCanvas = dynamic(() => import("@/components/castle/CastleCanvas"), {
  ssr: false,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <Fallback />;
    return this.props.children;
  }
}

type WebglSupport = "yes" | "no" | "unknown";

function webglSnapshot(): WebglSupport {
  return supportsWebGL() ? "yes" : "no";
}

export function Experience() {
  const webgl = useSyncExternalStore(
    () => () => {},
    webglSnapshot,
    (): WebglSupport => "unknown",
  );
  const [storiesOpen, setStoriesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [placesOpen, setPlacesOpen] = useState(false);
  const narrow = useMediaQuery("(max-width: 767px)");
  const reduced = useReducedMotion();

  const eraId = useCastle((state) => state.eraId);
  const evidence = useCastle((state) => state.evidence);
  const compareOn = useCastle((state) => state.compareOn);
  const compare = useCastle((state) => state.compare);
  const selectedId = useCastle((state) => state.selectedId);
  const tourId = useCastle((state) => state.tourId);
  const beatIndex = useCastle((state) => state.beatIndex);
  const playing = useCastle((state) => state.playing);
  const intro = useCastle((state) => state.intro);
  const setEra = useCastle((state) => state.setEra);
  const toggleEvidence = useCastle((state) => state.toggleEvidence);
  const setCompareOn = useCastle((state) => state.setCompareOn);
  const setCompare = useCastle((state) => state.setCompare);
  const select = useCastle((state) => state.select);
  const startTour = useCastle((state) => state.startTour);
  const exitTour = useCastle((state) => state.exitTour);
  const nextBeat = useCastle((state) => state.nextBeat);
  const prevBeat = useCastle((state) => state.prevBeat);
  const setPlaying = useCastle((state) => state.setPlaying);
  const dismissIntro = useCastle((state) => state.dismissIntro);
  const resetCamera = useCastle((state) => state.resetCamera);

  useEffect(() => {
    if (!playing || reduced || !tourId) return;
    const timer = window.setTimeout(() => nextBeat(), 8000);
    return () => window.clearTimeout(timer);
  }, [playing, reduced, tourId, beatIndex, nextBeat]);

  useEffect(() => {
    const node = document.getElementById(`era-${eraId}`);
    node?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
  }, [eraId, reduced]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest("button, a, input, textarea")) return;
      if (event.key === "Escape") select(null);
      if (event.key === "e" || event.key === "E") toggleEvidence();
      if (event.key === "c" || event.key === "C") setCompareOn(!useCastle.getState().compareOn);
      if (event.key === "ArrowRight") {
        if (tourId) nextBeat();
        else stepEra(1);
      }
      if (event.key === "ArrowLeft") {
        if (tourId) prevBeat();
        else stepEra(-1);
      }
      if (event.key === " " && tourId) {
        event.preventDefault();
        setPlaying(!useCastle.getState().playing);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextBeat, prevBeat, select, setCompareOn, setPlaying, toggleEvidence, tourId]);

  if (webgl === "no") return <Fallback />;

  const era = eraById(eraId);
  const tour = tours.find((item) => item.id === tourId) ?? null;
  const beat = tour?.beats[beatIndex] ?? null;
  const hotspot = selectedId ? hotspotById(selectedId) : null;
  const places = hotspots.filter((item) => item.eras.includes(eraId));

  return (
    <SceneBoundary>
      <div className="fixed inset-0 bg-[#c9d5dc] text-foreground">
        <h1 className="sr-only">Northampton Castle, an interactive history</h1>
        <div className="absolute inset-0 touch-none">
          <CastleCanvas />
        </div>

        <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-2 p-3">
          <div className="pointer-events-auto min-w-0 rounded-2xl bg-background/88 px-3 py-2 shadow-lg backdrop-blur-md">
            <p className="font-heading text-lg leading-none">Northampton Castle</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {era.year} · {era.blurb}
            </p>
          </div>
          <div className="pointer-events-auto flex flex-wrap justify-end gap-1.5">
            <Button variant="secondary" className="h-10" onClick={() => setStoriesOpen(true)}>
              <BookOpen />
              <span className="hidden sm:inline">Stories</span>
            </Button>
            <Button variant="secondary" className="h-10" onClick={() => setPlacesOpen(true)}>
              <MapPin />
              <span className="hidden sm:inline">Places</span>
            </Button>
            <Button
              variant={evidence ? "default" : "secondary"}
              className="h-10"
              aria-pressed={evidence}
              onClick={toggleEvidence}
            >
              <Eye />
              <span className="hidden sm:inline">Evidence</span>
            </Button>
            <Button
              variant={compareOn ? "default" : "secondary"}
              className="h-10"
              aria-pressed={compareOn}
              onClick={() => setCompareOn(!compareOn)}
            >
              <Columns2 />
              <span className="hidden md:inline">Then & now</span>
            </Button>
            <Button variant="secondary" className="h-10" onClick={resetCamera} aria-label="Reset the view">
              <RotateCcw />
            </Button>
            <Button variant="secondary" className="h-10" onClick={() => setAboutOpen(true)} aria-label="About this model">
              <Info />
            </Button>
          </div>
        </header>

        {evidence && (
          <ul className="pointer-events-none absolute top-20 left-3 z-10 hidden max-w-52 flex-col gap-1 rounded-xl bg-background/88 p-2 text-xs shadow-lg backdrop-blur-md sm:flex">
            {(Object.keys(confidenceMeta) as (keyof typeof confidenceMeta)[]).map((key) => (
              <li key={key} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{ background: confidenceMeta[key].swatch }}
                />
                {confidenceMeta[key].label}
              </li>
            ))}
          </ul>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 p-3">
          {tour && beat && (
            <section
              className="pointer-events-auto rounded-2xl bg-background/92 p-3 shadow-lg backdrop-blur-md"
              aria-live="polite"
            >
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <p className="font-heading text-base">{tour.title}</p>
                <p className="text-xs text-muted-foreground">
                  {beatIndex + 1} of {tour.beats.length}
                  {reduced ? " · tap to advance" : ""}
                </p>
              </div>
              <p className="text-sm leading-relaxed">{beat.caption}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" className="h-10" onClick={prevBeat} disabled={beatIndex === 0}>
                  <ChevronLeft />
                  Back
                </Button>
                <Button
                  className="h-10"
                  onClick={() => setPlaying(!playing)}
                  aria-pressed={playing}
                >
                  {playing && !reduced ? <Pause /> : <Play />}
                  {playing && !reduced ? "Pause" : "Play"}
                </Button>
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={nextBeat}
                  disabled={beatIndex === tour.beats.length - 1}
                >
                  Next
                  <ChevronRight />
                </Button>
                <Button variant="ghost" className="h-10" onClick={exitTour}>
                  Exit
                </Button>
              </div>
            </section>
          )}

          {compareOn && (
            <div className="pointer-events-auto rounded-2xl bg-background/92 px-3 py-2 shadow-lg backdrop-blur-md">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>{eraId === "today" ? "Today" : era.label}</span>
                <span>{eraId === "today" ? "Castle around 1300" : "Today, as a ghost"}</span>
              </div>
              <Slider
                aria-label={
                  eraId === "today"
                    ? "Strength of the castle overlay"
                    : "Strength of today's overlay"
                }
                min={0}
                max={100}
                step={1}
                value={[compare]}
                onValueChange={(value) => {
                  const next = Array.isArray(value) ? value[0] : value;
                  setCompare(next);
                }}
              />
            </div>
          )}

          <div className="pointer-events-auto rounded-2xl bg-background/92 p-2 shadow-lg backdrop-blur-md">
            <div className="flex gap-1 overflow-x-auto">
              {eras.map((item) => (
                <button
                  key={item.id}
                  id={`era-${item.id}`}
                  type="button"
                  aria-pressed={item.id === eraId}
                  onClick={() => setEra(item.id)}
                  className={`min-h-11 shrink-0 rounded-xl px-3 py-1.5 text-left ${
                    item.id === eraId
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  <span className="block text-sm font-medium">{item.year}</span>
                  <span className="block text-[11px] opacity-80">{item.label}</span>
                </button>
              ))}
            </div>
            <p className="px-1 pt-1 text-[11px] text-muted-foreground">
              Hall to the east, outer bailey to the south. Traced from a MOLA plan.
            </p>
          </div>
        </div>

        {intro && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-end justify-center p-4 sm:items-center">
            <div className="pointer-events-auto w-full max-w-md rounded-2xl bg-popover p-5 shadow-2xl">
              <p className="text-sm text-primary">A royal castle, then a railway station</p>
              <h2 className="mt-1 font-heading text-3xl leading-tight">
                The castle under Northampton station
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Simon de Senlis&apos;s castle stood west of the town from the late eleventh
                century until the railway demolished it in 1879. Drag to look around. The
                coloured stakes are places you can open.
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button
                  className="h-11 flex-1"
                  onClick={() => {
                    setStoriesOpen(false);
                    startTour("becket");
                  }}
                >
                  Follow Becket&apos;s trial
                </Button>
                <Button variant="outline" className="h-11 flex-1" onClick={dismissIntro}>
                  Explore on your own
                </Button>
              </div>
            </div>
          </div>
        )}

        <Sheet
          open={Boolean(hotspot)}
          onOpenChange={(open) => {
            if (!open) select(null);
          }}
          modal={narrow}
          disablePointerDismissal={!narrow}
        >
          <SheetContent
            side={narrow ? "bottom" : "right"}
            hideOverlay={!narrow}
            className={
              narrow ? "max-h-[62dvh] overflow-y-auto rounded-t-2xl pb-6" : "overflow-y-auto"
            }
          >
            {hotspot && (
              <>
                <SheetHeader>
                  <SheetTitle className="font-heading text-xl">{hotspot.name}</SheetTitle>
                  <SheetDescription>{hotspot.dates}</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-3 px-4 pb-4">
                  <p className="flex items-center gap-2 text-sm">
                    <span
                      className="size-2.5 rounded-full"
                      style={{ background: confidenceMeta[hotspot.confidence].swatch }}
                    />
                    {confidenceMeta[hotspot.confidence].label}
                    <span className="text-muted-foreground">
                      · {confidenceMeta[hotspot.confidence].meaning}
                    </span>
                  </p>
                  <p className="leading-relaxed">{hotspot.summary}</p>
                  <p className="leading-relaxed text-muted-foreground">{hotspot.detail}</p>
                  <Separator />
                  <ul className="flex flex-col gap-1 text-sm">
                    {hotspot.sources.map((source) => (
                      <li key={source.href}>
                        <a
                          className="underline underline-offset-2"
                          href={source.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </SheetContent>
        </Sheet>

        <Dialog open={storiesOpen} onOpenChange={setStoriesOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">Stories</DialogTitle>
              <DialogDescription>
                Captioned walks. Nothing is read aloud. Pause a story and you can look around.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {tours.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="rounded-xl bg-secondary px-3 py-3 text-left"
                  onClick={() => {
                    setStoriesOpen(false);
                    startTour(item.id);
                  }}
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-xs text-muted-foreground">{item.minutes}</span>
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.summary}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={placesOpen} onOpenChange={setPlacesOpen}>
          <DialogContent className="max-h-[80dvh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">
                Places in {era.year}
              </DialogTitle>
              <DialogDescription>
                The same points as the stakes in the model. Useful on a small screen.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              {places.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="rounded-xl bg-secondary px-3 py-3 text-left"
                  onClick={() => {
                    setPlacesOpen(false);
                    select(item.id);
                  }}
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{item.summary}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
          <DialogContent className="max-h-[80dvh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-heading text-xl">About this model</DialogTitle>
              <DialogDescription>
                A personal guide to a demolished castle. It is a schematic, built from documents
                and excavation reports, not a measured survey.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-3 text-sm leading-relaxed">
              <p>
                The outline follows a MOLA plan: a rounded inner bailey, the great hall in the
                1960s trenches east of St Andrew&apos;s Road, the outer bailey to the south under
                the station, and the former Nene on the west. Heights and roofs are still a
                reconstruction. The Evidence colours say what is excavated, recorded, or only
                inferred.
              </p>
              <p>
                Drag to orbit, pinch or scroll to zoom. Arrow keys move through the years, E
                toggles the evidence colours, and C lays today over the castle.
              </p>
              <Separator />
              <p className="font-medium">Where the research lives</p>
              <ul className="flex flex-col gap-1">
                <li>Northamptonshire Historic Environment Record, inner bailey 1160/1/4</li>
                <li>Historic England, Great Hall MNN30859</li>
                <li>Friends of Northampton Castle, timeline</li>
                <li>John Alexander&apos;s excavations, 1961–65, still mostly unpublished</li>
                <li>MOLA surveys east of St Andrew&apos;s Road, 2017–19</li>
              </ul>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SceneBoundary>
  );
}

function stepEra(direction: 1 | -1) {
  const { eraId, setEra } = useCastle.getState();
  const index = eras.findIndex((era) => era.id === eraId);
  const next = eras[index + direction];
  if (next) setEra(next.id as EraId);
}
