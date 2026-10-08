"use client";

import { BAILEY_D, BAILEY_W, HD, HW, type Confidence, type EraId } from "@/content/site";
import { useCastle } from "@/lib/store";
import { GhostScope, Mat, Tint } from "@/components/castle/materials";
import {
  Block,
  Causeway,
  Courtyard,
  Ground,
  House,
  Merlons,
  Moat,
  Palisade,
  Person,
  Ramparts,
  River,
  Tower,
  Trees,
  Wall,
} from "@/components/castle/parts";

function phaseOf(era: EraId) {
  if (era === "saxon") return "saxon";
  if (era === "timber") return "timber";
  if (era === "siege") return "damaged";
  if (era === "orchard") return "ruin";
  if (era === "demolition") return "demolition";
  return "stone";
}

function Curtain({ era }: { era: EraId }) {
  const phase = phaseOf(era);
  const broken = phase === "damaged";
  const ruin = phase === "ruin" || phase === "demolition";
  const height = ruin ? 3.4 : 8;
  const confidence: Confidence = era === "becket" ? "documented" : "recorded";
  const north: Parameters<typeof Wall>[0]["spec"][] = [
    { x: -39, z: -HD, length: 62, rotation: 0, height, confidence },
    { x: 39, z: -HD, length: 62, rotation: 0, height, confidence },
  ];
  const south = [
    { x: -40, z: HD, length: 58, rotation: 0, height, confidence },
    { x: 40, z: HD, length: 58, rotation: 0, height, confidence },
  ];
  const east = [{ x: HW, z: 0, length: BAILEY_DEPTH(ruin), rotation: Math.PI / 2, height, confidence }];
  const west = broken
    ? [
        { x: -HW, z: -28, length: 30, rotation: Math.PI / 2, height: 4.2, confidence: "recorded" as const },
        { x: -HW, z: 30, length: 26, rotation: Math.PI / 2, height: 3.6, confidence: "recorded" as const },
      ]
    : phase === "demolition"
      ? [{ x: -HW, z: 4, length: 34, rotation: Math.PI / 2, height: 5.2, confidence: "recorded" as const }]
      : [{ x: -HW, z: 0, length: 86, rotation: Math.PI / 2, height, confidence }];

  const walls = [
    ...north,
    ...(phase === "demolition" ? [] : south),
    ...(phase === "demolition" ? [] : east),
    ...west,
  ];

  return (
    <group>
      {walls.map((spec, index) => (
        <group key={index}>
          <Wall spec={spec} />
          {!ruin && !broken && <Merlons spec={spec} />}
        </group>
      ))}
      {broken && <Props />}
      {era !== "becket" && era !== "timber" && era !== "saxon" && <Buttresses />}
      <Gate height={height} ruin={ruin} />
      <Tower position={[-HW, 0, -HD]} radius={5.4} height={ruin ? 6 : 12} confidence="documented" broken={phase === "demolition"} />
      <Tower position={[HW, 0, -HD]} radius={5.4} height={ruin ? 6 : 12} confidence="documented" broken={ruin} />
      <Tower position={[HW, 0, HD]} radius={5.2} height={ruin ? 5 : 12} confidence="documented" broken={phase === "demolition"} />
      <Tower position={[-HW, 0, HD]} radius={5.2} height={ruin ? 5 : 12} confidence="documented" broken={ruin} />
      {phase !== "demolition" && (
        <Tower position={[HW, 0, 0]} radius={4.6} height={ruin ? 5 : 11} confidence="documented" broken={ruin} />
      )}
      <Tower
        position={[0, 0, HD]}
        radius={7.2}
        height={phase === "demolition" ? 6 : ruin ? 10 : 14}
        confidence="recorded"
        broken={phase === "demolition"}
      />
      {era === "civilwar" && <Cannon />}
    </group>
  );
}

function BAILEY_DEPTH(short: boolean) {
  return short ? 70 : 90;
}

function Gate({ height, ruin }: { height: number; ruin: boolean }) {
  if (ruin) return null;
  return (
    <group position={[0, 0, -HD]}>
      <Tower position={[-7.2, 0, 0]} radius={4} height={height + 3} confidence="documented" />
      <Tower position={[7.2, 0, 0]} radius={4} height={height + 3} confidence="documented" />
      <mesh position={[0, height + 0.6, 0]} castShadow>
        <boxGeometry args={[10, 1.4, 3.2]} />
        <Mat kind="stone" confidence="documented" />
      </mesh>
    </group>
  );
}

function Props() {
  return (
    <group>
      {[-18, -6, 8, 20].map((z) => (
        <mesh key={z} position={[-HW - 3.5, 2.4, z]} rotation={[0, 0, 0.7]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 7, 6]} />
          <Mat kind="timber" confidence="documented" />
        </mesh>
      ))}
    </group>
  );
}

function Buttresses() {
  return (
    <group>
      {[-16, 18].map((z) => (
        <mesh key={z} position={[-HW - 2.4, 2.2, z]} castShadow>
          <boxGeometry args={[4.2, 4.4, 2.6]} />
          <Mat kind="stone" confidence="recorded" />
        </mesh>
      ))}
    </group>
  );
}

function Cannon() {
  return (
    <group position={[0, 14.6, HD + 2]} rotation={[0.15, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.34, 2.4, 10]} />
        <Tint color="#2c3034" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.35, 0.2]}>
        <boxGeometry args={[1.1, 0.35, 1.4]} />
        <Tint color="#5c4632" />
      </mesh>
    </group>
  );
}

function Keep({ era }: { era: EraId }) {
  const site = useCastle((state) => state.keepSite);
  const phase = phaseOf(era);
  const position = site === "ne" ? [40, 0, -30] : [-46, 0, -22];
  const stone = phase !== "timber";
  const broken = phase === "ruin" || phase === "demolition";
  return (
    <group position={position as [number, number, number]}>
      <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[12, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Mat kind="grass" confidence="inferred" />
      </mesh>
      {phase !== "demolition" && (
        <mesh position={[0, stone ? 9 : 7.5, 0]} castShadow>
          {stone ? (
            <boxGeometry args={[11, broken ? 7 : 14, 11]} />
          ) : (
            <cylinderGeometry args={[3.2, 3.6, 8, 8]} />
          )}
          <Mat kind={stone ? "stone" : "timber"} confidence="inferred" />
        </mesh>
      )}
    </group>
  );
}

function Halls({ era }: { era: EraId }) {
  const cutaway = useCastle((state) => state.cutaway);
  const phase = phaseOf(era);
  const ruin = phase === "ruin" || phase === "demolition";
  const full = era === "peak" || era === "civilwar" || era === "orchard" || era === "siege";
  return (
    <group>
      <Block
        position={[0, 0, -6]}
        size={[34, 7.2, 13]}
        confidence="documented"
        ruin={ruin}
        cutaway={cutaway}
      />
      {(era === "becket" || full) && (
        <Block
          position={[0, 0, -20]}
          size={[16, era === "becket" ? 8.4 : 6.4, 8]}
          confidence="documented"
          ruin={ruin}
          cutaway={cutaway}
        />
      )}
      {full && (
        <>
          <Block position={[-24, 0, -6]} size={[14, 6.2, 11]} confidence="documented" ruin={ruin} />
          <Block position={[24, 0, -6]} size={[16, 6.2, 11]} confidence="documented" ruin={ruin} />
          <Block position={[10, 0, 16]} size={[12, 4.6, 8]} confidence="excavated" ruin={ruin} roofKind="thatch" />
          <Block position={[38, 0, -30]} size={[18, 5, 8]} confidence="excavated" ruin={ruin} />
        </>
      )}
      {(era === "peak" || era === "civilwar") && (
        <group position={[48, 0, -8]}>
          <Block position={[0, 0, 0]} size={[8, 5.5, 14]} confidence="inferred" />
          <mesh position={[0, 2.4, -8]} castShadow>
          <cylinderGeometry args={[4, 4, 4.8, 12]} />
          <Mat kind="stone" confidence="inferred" />
        </mesh>
        </group>
      )}
      {era === "becket" && !cutaway && (
        <>
          <Person position={[2, 0, 4]} color="#f2f0ea" />
          <Person position={[-2, 0, 6]} color="#8d2f2f" />
          <Person position={[4, 0, 8]} color="#3d4f73" />
        </>
      )}
      {cutaway && (
        <>
          <Person position={[-2, 0, -4]} color="#f4f1ea" />
          <Person position={[3, 0, -2]} color="#6d2430" />
          <Person position={[6, 0, -16]} color="#c9a36a" />
          <Person position={[8, 0, -18]} color="#31425f" />
          <Person position={[4, 0, -18]} color="#31425f" />
        </>
      )}
      {(era === "peak" || era === "civilwar") && <Smoke position={[10, 8, 16]} />}
    </group>
  );
}

function Smoke({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={[position[0], position[1], position[2]]}>
      <sphereGeometry args={[1.1, 8, 8]} />
      <Tint color="#d9d4cc" />
    </mesh>
  );
}

function PosternArch() {
  return (
    <group position={[-HW - 0.2, 0, 22]}>
      <mesh position={[-1.5, 2.1, 0]} castShadow>
        <boxGeometry args={[1.1, 4.2, 1.6]} />
        <Mat kind="stone" confidence="recorded" />
      </mesh>
      <mesh position={[1.5, 2.1, 0]} castShadow>
        <boxGeometry args={[1.1, 4.2, 1.6]} />
        <Mat kind="stone" confidence="recorded" />
      </mesh>
      <mesh position={[0, 4.4, 0]} castShadow>
        <boxGeometry args={[4.2, 1, 1.6]} />
        <Mat kind="stone" confidence="recorded" />
      </mesh>
    </group>
  );
}

function Town() {
  const houses: [number, number, number][] = [
    [190, 0, -10],
    [204, 0, 8],
    [214, 0, 22],
    [188, 0, 28],
    [206, 0, 40],
    [222, 0, -8],
  ];
  return (
    <group>
      {houses.map((position, index) => (
        <House key={index} position={position} scale={0.9 + (index % 3) * 0.15} />
      ))}
    </group>
  );
}

function Priory() {
  return (
    <group position={[70, 0, -150]}>
      <Block position={[0, 0, 0]} size={[16, 7, 8]} confidence="inferred" />
      <mesh position={[-14, 1.2, 6]}>
        <boxGeometry args={[1, 2.4, 10]} />
        <Mat kind="stone" confidence="inferred" />
      </mesh>
      <mesh position={[-14, 1.2, -8]}>
        <boxGeometry args={[1, 2.4, 8]} />
        <Mat kind="stone" confidence="inferred" />
      </mesh>
    </group>
  );
}

function SiegeCamp() {
  return (
    <group position={[10, 0, 92]}>
      {[0, 8, 16].map((x) => (
        <mesh key={x} position={[x, 1.6, 0]} castShadow>
          <coneGeometry args={[2.4, 3.2, 8]} />
          <Tint color="#8d3d32" />
        </mesh>
      ))}
      <mesh position={[24, 3.2, 4]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.16, 0.16, 8, 5]} />
        <Tint color="#6b452c" />
      </mesh>
      <mesh position={[28, 3.2, 4]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.16, 0.16, 8, 5]} />
        <Tint color="#6b452c" />
      </mesh>
    </group>
  );
}

function OuterWard() {
  return (
    <group>
      <mesh position={[0, 1.1, -HD - 78]} receiveShadow>
        <boxGeometry args={[150, 2.2, 46]} />
        <Mat kind="grass" confidence="inferred" />
      </mesh>
      <mesh position={[0, 2.2, -HD - 100]}>
        <boxGeometry args={[150, 2.4, 1.4]} />
        <Mat kind="stone" confidence="inferred" />
      </mesh>
    </group>
  );
}

function SaxonHuts() {
  return (
    <group>
      <House position={[18, 0, 12]} scale={0.7} />
      <House position={[8, 0, -8]} scale={0.55} />
      <House position={[28, 0, -4]} scale={0.6} />
      <Palisade width={70} depth={48} />
    </group>
  );
}

function Rubble() {
  const piles: [number, number, number, number][] = [
    [20, 0.8, 30, 3],
    [-20, 0.6, 10, 2.4],
    [50, 0.7, -20, 2],
    [-40, 0.9, -30, 2.6],
    [0, 0.5, 40, 3.4],
  ];
  return (
    <group>
      {piles.map(([x, y, z, s], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0.4, index, 0.2]}>
          <dodecahedronGeometry args={[s, 0]} />
          <Tint color="#8a7362" />
        </mesh>
      ))}
      <mesh position={[-10, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[8, 220]} />
        <Tint color="#4a463f" />
      </mesh>
    </group>
  );
}

export function HistoricalSite({
  era,
  ghostOpacity,
}: {
  era: EraId;
  ghostOpacity: number;
}) {
  const phase = phaseOf(era);
  const walled = phase !== "saxon";
  return (
    <GhostScope opacity={ghostOpacity}>
      <Ground />
      <River />
      <Ramparts height={phase === "saxon" ? 1.4 : 3.3} />
      <Moat scale={phase === "saxon" ? 0.4 : 1} />
      <Courtyard />
      {phase === "saxon" && <SaxonHuts />}
      {phase === "timber" && (
        <>
          <Palisade width={BAILEY_W} depth={BAILEY_D} />
          <Causeway timber />
          <Block position={[0, 0, -4]} size={[22, 5, 10]} confidence="inferred" roofKind="thatch" />
        </>
      )}
      {walled && phase !== "timber" && (
        <>
          <Curtain era={era} />
          <Causeway />
          <PosternArch />
          <Halls era={era} />
        </>
      )}
      {walled && <Keep era={era} />}
      {phase !== "saxon" && phase !== "demolition" && phase !== "ruin" && <Town />}
      {(phase === "timber" || phase === "stone" || phase === "damaged") && <OuterWard />}
      {era === "siege" && (
        <>
          <Priory />
          <SiegeCamp />
        </>
      )}
      {(era === "orchard" || era === "demolition") && (
        <Trees count={era === "orchard" ? 18 : 7} spread={[110, 70]} />
      )}
      {phase === "demolition" && <Rubble />}
    </GhostScope>
  );
}
