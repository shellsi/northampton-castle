"use client";

import { confidenceMeta, hotspots, type EraId } from "@/content/site";
import { useCastle } from "@/lib/store";

export function HotspotMarkers({ era }: { era: EraId }) {
  const selectedId = useCastle((state) => state.selectedId);
  const select = useCastle((state) => state.select);

  return (
    <group>
      {hotspots
        .filter((hotspot) => hotspot.eras.includes(era))
        .map((hotspot) => {
          const position = hotspot.position;
          const selected = selectedId === hotspot.id;
          const color = selected ? "#f3e2c2" : confidenceMeta[hotspot.confidence].swatch;
          return (
            <group key={hotspot.id} position={[position[0], 0, position[2]]}>
              <mesh position={[0, 4.2, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 8.4, 6]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh
                position={[0, 8.8, 0]}
                onClick={(event) => {
                  event.stopPropagation();
                  select(hotspot.id);
                }}
                onPointerOver={(event) => {
                  event.stopPropagation();
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  document.body.style.cursor = "auto";
                }}
              >
                <sphereGeometry args={[selected ? 1.7 : 1.25, 14, 14]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
              </mesh>
            </group>
          );
        })}
    </group>
  );
}
