"use client";

import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import * as THREE from "three";
import { confidenceMeta, type Confidence } from "@/content/site";
import { useCastle } from "@/lib/store";
import { makeTextures, type TextureKind, type TextureSet } from "@/components/castle/textures";

const TexturesContext = createContext<TextureSet | null>(null);
const GhostContext = createContext(0);

export function TextureProvider({ children }: { children: ReactNode }) {
  const textures = useMemo(() => makeTextures(), []);
  useEffect(() => {
    return () => {
      Object.values(textures).forEach((texture) => texture.dispose());
    };
  }, [textures]);
  return <TexturesContext.Provider value={textures}>{children}</TexturesContext.Provider>;
}

export function GhostScope({
  opacity,
  children,
}: {
  opacity: number;
  children: ReactNode;
}) {
  return <GhostContext.Provider value={opacity}>{children}</GhostContext.Provider>;
}

export function useGhostOpacity() {
  return useContext(GhostContext);
}

export function Tint({
  color,
  roughness = 0.85,
  metalness = 0,
}: {
  color: string;
  roughness?: number;
  metalness?: number;
}) {
  const ghost = useContext(GhostContext);
  if (ghost > 0) {
    return (
      <meshStandardMaterial
        color="#e7d7b8"
        transparent
        opacity={ghost}
        depthWrite={false}
        roughness={1}
      />
    );
  }
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />;
}

export function Mat({
  kind,
  confidence = "inferred",
  evidenceAware = true,
  side = THREE.FrontSide,
  roughness = 0.92,
  metalness = 0,
}: {
  kind: TextureKind;
  confidence?: Confidence;
  evidenceAware?: boolean;
  side?: THREE.Side;
  roughness?: number;
  metalness?: number;
}) {
  const textures = useContext(TexturesContext);
  const ghost = useContext(GhostContext);
  const evidence = useCastle((state) => state.evidence);
  if (!textures) return null;

  if (ghost > 0) {
    return (
      <meshStandardMaterial
        color="#e7d7b8"
        transparent
        opacity={ghost}
        depthWrite={false}
        roughness={1}
        side={side}
      />
    );
  }

  const showEvidence = evidence && evidenceAware;
  const wire = showEvidence && confidence === "inferred";
  return (
    <meshStandardMaterial
      map={wire ? null : textures[kind]}
      color={showEvidence ? confidenceMeta[confidence].swatch : "#ffffff"}
      wireframe={wire}
      roughness={roughness}
      metalness={metalness}
      side={side}
    />
  );
}
