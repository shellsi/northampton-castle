"use client";

import { INNER_RX, INNER_RZ, onRing, places } from "@/content/plan";
import { GhostScope, Mat, Tint } from "@/components/castle/materials";
import { River, useEllipseGeometry } from "@/components/castle/parts";

export function ModernSite({ ghostOpacity }: { ghostOpacity: number }) {
  const solid = ghostOpacity === 0;
  const park = useEllipseGeometry(30, 40);
  return (
    <GhostScope opacity={ghostOpacity}>
      {solid && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[16, 0.02, 36]} receiveShadow>
            <planeGeometry args={[860, 720]} />
            <Mat kind="grass" evidenceAware={false} />
          </mesh>
          <River />
        </>
      )}
      <mesh position={[places.road[0], 0.14, 28]} receiveShadow>
        <boxGeometry args={[11, 0.2, 360]} />
        <Mat kind="asphalt" confidence="survives" />
      </mesh>
      <mesh geometry={park} position={[-8, 0.1, 4]} receiveShadow>
        <Mat kind="asphalt" confidence="survives" side={2} />
      </mesh>
      <mesh position={[-8, 0.16, 132]} receiveShadow>
        <boxGeometry args={[160, 0.22, 8]} />
        <Mat kind="asphalt" confidence="survives" />
      </mesh>
      {[-2.4, 2.4].map((offset) => (
        <mesh key={offset} position={[-8, 0.32, 132 + offset]}>
          <boxGeometry args={[150, 0.08, 0.12]} />
          <Tint color="#c5ccd2" metalness={0.65} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[-22, 0.38, 122]} receiveShadow>
        <boxGeometry args={[78, 0.35, 7]} />
        <Mat kind="plaster" confidence="survives" />
      </mesh>
      <mesh position={[-22, 0.38, 142]} receiveShadow>
        <boxGeometry args={[78, 0.35, 7]} />
        <Mat kind="plaster" confidence="survives" />
      </mesh>
      <group position={[-36, 0, 152]}>
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[46, 8.4, 16]} />
          <Mat kind="plaster" confidence="survives" />
        </mesh>
        <mesh position={[0, 8.6, 0]} castShadow>
          <boxGeometry args={[50, 0.45, 20]} />
          <Mat kind="iron" confidence="survives" metalness={0.4} roughness={0.45} />
        </mesh>
      </group>
      <mesh position={[30, 0.16, 186]} receiveShadow>
        <boxGeometry args={[210, 0.18, 12]} />
        <Mat kind="asphalt" confidence="survives" />
      </mesh>
      <mesh position={[-108, 0.28, 186]} receiveShadow>
        <boxGeometry args={[46, 0.35, 9]} />
        <Mat kind="stone" confidence="survives" />
      </mesh>
      <group position={places.bankToday}>
        <mesh position={[0, 1.7, 0]} receiveShadow>
          <boxGeometry args={[12, 3.4, 28]} />
          <Mat kind="earth" confidence="survives" />
        </mesh>
        <mesh position={[-4, 0.7, 2]}>
          <boxGeometry args={[0.8, 1.4, 6]} />
          <Mat kind="stone" confidence="survives" />
        </mesh>
      </group>
      <group position={[places.posternToday[0], 0, places.posternToday[2]]}>
        <mesh position={[-1.6, 1.7, 0]} castShadow>
          <boxGeometry args={[1.15, 3.4, 1.5]} />
          <Mat kind="stone" confidence="survives" />
        </mesh>
        <mesh position={[1.6, 1.7, 0]} castShadow>
          <boxGeometry args={[1.15, 3.4, 1.5]} />
          <Mat kind="stone" confidence="survives" />
        </mesh>
        <mesh position={[0, 3.6, 0]} castShadow>
          <boxGeometry args={[4.4, 1.05, 1.5]} />
          <Mat kind="stone" confidence="survives" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[2.1, 2.2, 0.4]} />
          <Tint color="#1b1814" />
        </mesh>
      </group>
      <mesh position={[places.fort[0], 0.55, places.fort[2]]} scale={[30, 0.45, 24]}>
        <sphereGeometry args={[1, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Mat kind="earth" confidence="recorded" />
      </mesh>
      {[0.15, 1.2, 2.15, 3.36, 4.4, 5.2].map((angle) => {
        const [x, z] = onRing(angle, INNER_RX + 4, INNER_RZ + 4);
        return (
          <mesh key={angle} position={[x, 1.6, z]}>
            <cylinderGeometry args={[0.16, 0.2, 3.2, 8]} />
            <Mat kind="iron" confidence="survives" />
          </mesh>
        );
      })}
    </GhostScope>
  );
}
