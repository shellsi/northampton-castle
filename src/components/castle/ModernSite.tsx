"use client";

import { GhostScope, Mat, Tint } from "@/components/castle/materials";
import { River } from "@/components/castle/parts";

export function ModernSite({ ghostOpacity }: { ghostOpacity: number }) {
  const solid = ghostOpacity === 0;
  return (
    <GhostScope opacity={ghostOpacity}>
      {solid && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[30, 0.02, 0]} receiveShadow>
            <planeGeometry args={[780, 620]} />
            <Mat kind="grass" evidenceAware={false} />
          </mesh>
          <River />
        </>
      )}
      <mesh position={[-4, 0.18, 10]} receiveShadow>
        <boxGeometry args={[16, 0.28, 280]} />
        <Mat kind="asphalt" confidence="survives" />
      </mesh>
      {[-2.1, 2.1].map((x) => (
        <mesh key={x} position={[x, 0.42, 10]}>
          <boxGeometry args={[0.12, 0.12, 270]} />
          <Tint color="#b7bcc2" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      <mesh position={[-9, 0.35, 12]} receiveShadow>
        <boxGeometry args={[6, 0.4, 150]} />
        <Mat kind="plaster" confidence="survives" />
      </mesh>
      <mesh position={[5, 0.35, 12]} receiveShadow>
        <boxGeometry args={[5, 0.4, 150]} />
        <Mat kind="plaster" confidence="survives" />
      </mesh>
      <group position={[-8, 0, 18]}>
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[22, 8.4, 78]} />
          <Mat kind="plaster" confidence="survives" />
        </mesh>
        <mesh position={[0, 6.2, 0]}>
          <boxGeometry args={[22.4, 2.2, 78.4]} />
          <Mat kind="plaster" confidence="survives" />
        </mesh>
        <mesh position={[0, 8.7, 0]} castShadow>
          <boxGeometry args={[26, 0.5, 84]} />
          <Mat kind="iron" confidence="survives" metalness={0.4} roughness={0.45} />
        </mesh>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[36, 0.08, 42]} receiveShadow>
        <planeGeometry args={[48, 60]} />
        <Mat kind="asphalt" confidence="survives" />
      </mesh>
      <mesh position={[64, 0.12, 0]} receiveShadow>
        <boxGeometry args={[14, 0.2, 280]} />
        <Mat kind="asphalt" confidence="survives" />
      </mesh>
      <group position={[88, 0, -6]}>
        <mesh position={[0, 1.6, 0]} receiveShadow>
          <boxGeometry args={[10, 3.2, 26]} />
          <Mat kind="earth" confidence="survives" />
        </mesh>
        <mesh position={[-3.2, 0.7, 2]}>
          <boxGeometry args={[0.8, 1.4, 6]} />
          <Mat kind="stone" confidence="survives" />
        </mesh>
      </group>
      <group position={[-28, 0, 74]}>
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
      {[
        [-70, -46],
        [70, -46],
        [70, 46],
        [-70, 46],
        [0, -46],
        [0, 50],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 1.6, z]}>
          <cylinderGeometry args={[0.18, 0.22, 3.2, 8]} />
          <Mat kind="iron" confidence="survives" />
        </mesh>
      ))}
    </GhostScope>
  );
}
