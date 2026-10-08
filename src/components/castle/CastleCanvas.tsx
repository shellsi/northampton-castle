"use client";

import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import type CameraControlsImpl from "camera-controls";
import * as THREE from "three";
import { moodFor, skyFor } from "@/content/site";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useCastle } from "@/lib/store";
import { TextureProvider } from "@/components/castle/materials";
import { HistoricalSite } from "@/components/castle/HistoricalSite";
import { HotspotMarkers } from "@/components/castle/HotspotMarkers";
import { ModernSite } from "@/components/castle/ModernSite";

function Lighting() {
  const eraId = useCastle((state) => state.eraId);
  const moodOverride = useCastle((state) => state.mood);
  const mood = moodOverride ?? moodFor(eraId);
  const color = skyFor[mood];
  const evening = mood === "evening";
  const dawn = mood === "dawn";
  const night = mood === "night";
  const sun: [number, number, number] = night
    ? [-30, 40, 20]
    : evening
      ? [-90, 28, 40]
      : dawn
        ? [50, 36, -100]
        : [90, 120, 70];

  return (
    <>
      <color attach="background" args={[color]} />
      <fog attach="fog" args={[color, mood === "night" ? 50 : 180, mood === "night" ? 320 : 680]} />
      <hemisphereLight
        args={[night ? "#243044" : "#e7eef2", "#6a7a48", night ? 0.2 : 0.62]}
      />
      <directionalLight
        position={sun}
        intensity={night ? 0.18 : mood === "overcast" ? 0.75 : evening ? 1.15 : 1.25}
        color={evening ? "#ffb56a" : dawn ? "#ffd2b8" : "#fff6e8"}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={10}
        shadow-camera-far={520}
        shadow-camera-left={-190}
        shadow-camera-right={190}
        shadow-camera-top={190}
        shadow-camera-bottom={-190}
      />
      {night && (
        <pointLight position={[-62, 6, 24]} intensity={40} distance={90} color="#ffcc88" />
      )}
    </>
  );
}

function Rig() {
  const camera = useCastle((state) => state.camera);
  const nonce = useCastle((state) => state.cameraNonce);
  const reduced = useReducedMotion();
  const controls = useRef<CameraControlsImpl>(null);

  useEffect(() => {
    let frame = 0;
    let id = 0;
    const move = () => {
      const rig = controls.current;
      if (!rig) {
        if (frame < 45) {
          frame += 1;
          id = requestAnimationFrame(move);
        }
        return;
      }
      const [px, py, pz] = camera.position;
      const [tx, ty, tz] = camera.target;
      void rig.setLookAt(px, py, pz, tx, ty, tz, !reduced);
    };
    move();
    return () => cancelAnimationFrame(id);
  }, [camera, nonce, reduced]);

  return (
    <CameraControls
      ref={controls}
      minDistance={12}
      maxDistance={480}
      maxPolarAngle={Math.PI / 2 - 0.42}
      minPolarAngle={0.18}
      smoothTime={reduced ? 0 : 0.5}
    />
  );
}

function World() {
  const eraId = useCastle((state) => state.eraId);
  const compareOn = useCastle((state) => state.compareOn);
  const compare = useCastle((state) => state.compare);
  const ghostOpacity = 0.16 + (compare / 100) * 0.4;
  const overlayToday = compareOn && eraId !== "today";
  const overlayCastle = compareOn && eraId === "today";

  return (
    <>
      <Lighting />
      <Rig />
      {eraId !== "today" && <HistoricalSite era={eraId} ghostOpacity={0} />}
      {overlayCastle && <HistoricalSite era="peak" ghostOpacity={ghostOpacity} />}
      {(eraId === "today" || overlayToday) && (
        <ModernSite ghostOpacity={eraId === "today" ? 0 : ghostOpacity} />
      )}
      <HotspotMarkers era={eraId} />
    </>
  );
}

export default function CastleCanvas() {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.6]}
      camera={{ position: [168, 128, 172], fov: 40, near: 0.4, far: 2000 }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 1.05;
      }}
    >
      <TextureProvider>
        <World />
      </TextureProvider>
    </Canvas>
  );
}
