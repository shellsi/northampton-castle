"use client";

import { useMemo } from "react";
import {
  GATE_ANGLE,
  INNER_RX,
  INNER_RZ,
  OUTER_CENTER,
  OUTER_RX,
  OUTER_RZ,
  POSTERN_ANGLE,
  SOUTH_ANGLE,
  angDist,
  gatePoint,
  inWestArc,
  onRing,
  places,
  posternPoint,
  southTowerPoint,
  westWallPoint,
} from "@/content/plan";
import { type Confidence, type EraId } from "@/content/site";
import { useCastle } from "@/lib/store";
import { GhostScope, Mat, Tint } from "@/components/castle/materials";
import {
  Block,
  Causeway,
  Courtyard,
  Ground,
  House,
  Merlons,
  Palisade,
  Person,
  RingBank,
  RingDitch,
  River,
  Tower,
  Trees,
  Wall,
  ringSegments,
  useEllipseGeometry,
} from "@/components/castle/parts";

function phaseOf(era: EraId) {
  if (era === "saxon") return "saxon" as const;
  if (era === "timber") return "timber" as const;
  if (era === "siege") return "damaged" as const;
  if (era === "orchard") return "ruin" as const;
  if (era === "demolition") return "demolition" as const;
  return "stone" as const;
}

function project(angle: number, extra: number, rx = INNER_RX, rz = INNER_RZ): [number, number, number] {
  const [x, z] = onRing(angle, rx, rz);
  return [x + Math.sin(angle) * extra, 0, z - Math.cos(angle) * extra];
}

function curtainConfidence(angle: number): Confidence {
  if (inWestArc(angle)) return "recorded";
  if (angle > 0.85 && angle < 2.35) return "excavated";
  return "documented";
}

function Curtain({ era }: { era: EraId }) {
  const phase = phaseOf(era);
  const broken = phase === "damaged";
  const ruin = phase === "ruin" || phase === "demolition";
  const specs = useMemo(() => {
    return ringSegments(INNER_RX, INNER_RZ, 36).flatMap((segment) => {
      if (angDist(segment.angle, GATE_ANGLE) < 0.22) return [];
      if (angDist(segment.angle, POSTERN_ANGLE) < 0.14) return [];
      if (angDist(segment.angle, SOUTH_ANGLE) < 0.2) return [];
      if (phase === "demolition" && !inWestArc(segment.angle)) return [];
      const west = inWestArc(segment.angle);
      let height = ruin ? 3.4 : 8;
      if (broken && west) height = 3.8;
      if (phase === "demolition") height = 5.2;
      return [
        {
          x: segment.x,
          z: segment.z,
          length: segment.length,
          rotation: segment.rotation,
          height,
          confidence: curtainConfidence(segment.angle),
        },
      ];
    });
  }, [broken, phase, ruin]);

  const towerAngles = [1.15, 2.15, 4.05, 4.85, 5.75];

  return (
    <group>
      {specs.map((spec, index) => (
        <group key={index}>
          <Wall spec={spec} />
          {!ruin && !broken && <Merlons spec={spec} />}
        </group>
      ))}
      {broken && <Props />}
      {era !== "becket" && <Buttresses />}
      {!ruin && <Gate height={ruin ? 3.4 : 8} />}
      {towerAngles.map((angle) => {
        if (phase === "demolition" && !inWestArc(angle)) return null;
        return (
          <Tower
            key={angle}
            position={project(angle, 1)}
            radius={4.5}
            height={ruin ? 5 : 11}
            confidence={curtainConfidence(angle)}
            broken={phase === "demolition" || (ruin && !inWestArc(angle))}
          />
        );
      })}
      <Tower
        position={project(SOUTH_ANGLE, 5)}
        radius={7.2}
        height={phase === "demolition" ? 6 : ruin ? 10 : 14}
        confidence="recorded"
        broken={phase === "demolition"}
      />
      {era === "civilwar" && <Cannon />}
    </group>
  );
}

function Gate({ height }: { height: number }) {
  const [gx, , gz] = gatePoint;
  const tx = Math.cos(GATE_ANGLE);
  const tz = Math.sin(GATE_ANGLE);
  return (
    <group position={[gx, 0, gz]}>
      <Tower position={[-tx * 7.2, 0, -tz * 7.2]} radius={4} height={height + 3} confidence="documented" />
      <Tower position={[tx * 7.2, 0, tz * 7.2]} radius={4} height={height + 3} confidence="documented" />
      <mesh position={[0, height + 0.6, 0]} rotation={[0, Math.atan2(-tz, tx), 0]} castShadow>
        <boxGeometry args={[10, 1.4, 3.4]} />
        <Mat kind="stone" confidence="documented" />
      </mesh>
    </group>
  );
}

function Props() {
  return (
    <group>
      {[3.55, 4.05, 4.55, 5.05].map((angle) => {
        const [x, , z] = project(angle, 4);
        return (
          <mesh
            key={angle}
            position={[x, 2.4, z]}
            rotation={[0.15, Math.atan2(Math.sin(angle), -Math.cos(angle)), 0.65]}
            castShadow
          >
            <cylinderGeometry args={[0.18, 0.22, 7, 6]} />
            <Mat kind="timber" confidence="documented" />
          </mesh>
        );
      })}
    </group>
  );
}

function Buttresses() {
  return (
    <group>
      {[4.3, 4.9].map((angle) => (
        <mesh
          key={angle}
          position={project(angle, 3.2)}
          rotation={[0, Math.atan2(Math.sin(angle), -Math.cos(angle)), 0]}
          castShadow
        >
          <boxGeometry args={[2.8, 4.4, 5.2]} />
          <Mat kind="stone" confidence="recorded" />
        </mesh>
      ))}
    </group>
  );
}

function Cannon() {
  const [x, , z] = project(SOUTH_ANGLE, 6);
  return (
    <group position={[x, 14.6, z]} rotation={[0.12, SOUTH_ANGLE, 0]}>
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

function Barrow() {
  const [x, , z] = places.barrow;
  return (
    <mesh position={[x, 2.6, z]} castShadow receiveShadow>
      <sphereGeometry args={[11, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <Mat kind="grass" confidence="recorded" />
    </mesh>
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
        position={places.hall}
        size={[12, 7.2, 26]}
        confidence="excavated"
        ruin={ruin}
        cutaway={cutaway}
      />
      {era !== "demolition" && (
        <Block
          position={places.hallQuery}
          size={[18, 5.2, 10]}
          confidence="inferred"
          ruin={ruin}
        />
      )}
      {(era === "becket" || full) && (
        <Block
          position={places.queens}
          size={[11, era === "becket" ? 8.2 : 6.2, 7]}
          confidence="documented"
          ruin={ruin}
        />
      )}
      {full && (
        <>
          <Block position={places.greatChamber} size={[9, 6.2, 16]} confidence="documented" ruin={ruin} />
          <Block position={places.longChamber} size={[8, 6, 18]} confidence="documented" ruin={ruin} />
          <Block
            position={places.kitchen}
            size={[8, 4.6, 8]}
            confidence="excavated"
            ruin={ruin}
            roofKind="thatch"
          />
          <Block position={places.apartments} size={[10, 5, 8]} confidence="excavated" ruin={ruin} />
        </>
      )}
      {(era === "peak" || era === "civilwar") && (
        <Block position={places.chapel} size={[8, 5.2, 8]} confidence="inferred" ruin={false} />
      )}
      {era === "becket" && !cutaway && (
        <>
          <Person position={[48, 0, 24]} color="#f2f0ea" />
          <Person position={[52, 0, 26]} color="#8d2f2f" />
          <Person position={[46, 0, 28]} color="#3d4f73" />
        </>
      )}
      {cutaway && (
        <>
          <Person position={[48, 0, 8]} color="#f4f1ea" />
          <Person position={[52, 0, 4]} color="#6d2430" />
          <Person position={[44, 0, -14]} color="#c9a36a" />
          <Person position={[48, 0, -16]} color="#31425f" />
          <Person position={[50, 0, -12]} color="#31425f" />
        </>
      )}
      {(era === "peak" || era === "civilwar") && <Smoke position={[places.kitchen[0], 8, places.kitchen[2]]} />}
    </group>
  );
}

function Smoke({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[1.1, 8, 8]} />
      <Tint color="#d9d4cc" />
    </mesh>
  );
}

function PosternArch() {
  const [x, , z] = posternPoint;
  return (
    <group position={[x, 0, z]} rotation={[0, Math.atan2(Math.sin(POSTERN_ANGLE), -Math.cos(POSTERN_ANGLE)), 0]}>
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
    [8, 0, 208],
    [28, 0, 216],
    [52, 0, 204],
    [74, 0, 214],
    [96, 0, 196],
    [-8, 0, 200],
    [118, 0, 176],
    [108, 0, 158],
  ];
  return (
    <group>
      {houses.map((position, index) => (
        <House key={index} position={position} scale={0.85 + (index % 3) * 0.12} />
      ))}
    </group>
  );
}

function Priory() {
  const [x, , z] = places.priory;
  return (
    <group position={[x, 0, z]}>
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
    <group position={[48, 0, 188]}>
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

function CivilWar() {
  const [sx, , sz] = project(SOUTH_ANGLE, 8);
  return (
    <group>
      <mesh position={[sx - 4, 1.6, sz + 18]} scale={[1.15, 0.28, 0.42]}>
        <sphereGeometry args={[22, 18, 12]} />
        <Mat kind="earth" confidence="documented" />
      </mesh>
      <mesh position={[INNER_RX + 16, 1.5, 6]} scale={[0.36, 0.26, 1.05]}>
        <sphereGeometry args={[26, 18, 12]} />
        <Mat kind="earth" confidence="documented" />
      </mesh>
      <mesh position={[sx, 14.15, sz]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[6.2, 20]} />
        <Mat kind="stone" confidence="recorded" side={2} />
      </mesh>
      {[
        [sx - 10, sz + 16],
        [sx + 8, sz + 14],
        [INNER_RX + 10, -8],
      ].map(([x, z], index) => (
        <mesh key={index} position={[x, 1.5, z]} castShadow>
          <coneGeometry args={[2.2, 3, 8]} />
          <Tint color="#6d2f2a" />
        </mesh>
      ))}
    </group>
  );
}

function OuterWard({ broken = false }: { broken?: boolean }) {
  const geometry = useEllipseGeometry(OUTER_RX - 6, OUTER_RZ - 6);
  const walls = useMemo(
    () =>
      ringSegments(OUTER_RX, OUTER_RZ, 28, OUTER_CENTER).filter(
        (segment) => segment.angle > 1.15 && segment.angle < 5.05,
      ),
    [],
  );
  return (
    <group>
      <mesh geometry={geometry} position={[OUTER_CENTER[0], 0.07, OUTER_CENTER[1]]} receiveShadow>
        <Mat kind="grass" confidence="inferred" side={2} />
      </mesh>
      {walls.map((segment, index) => (
        <mesh
          key={index}
          position={[segment.x, broken ? 0.7 : 1.6, segment.z]}
          rotation={[0, segment.rotation, 0]}
          castShadow
        >
          <boxGeometry args={[segment.length, broken ? 1.2 : 3.1, 1.6]} />
          <Mat kind="timber" confidence="inferred" />
        </mesh>
      ))}
      <RingDitch
        rx={OUTER_RX + 12}
        rz={OUTER_RZ + 10}
        width={12}
        center={OUTER_CENTER}
        from={1.05}
        to={5.15}
      />
    </group>
  );
}

function Fort() {
  const geometry = useEllipseGeometry(22, 18);
  return (
    <group>
      <RingBank
        rx={32}
        rz={26}
        height={2.4}
        thickness={9}
        center={[places.fort[0], places.fort[2]]}
        confidence="recorded"
      />
      <mesh geometry={geometry} position={[places.fort[0], 0.1, places.fort[2]]} receiveShadow>
        <Mat kind="grass" confidence="recorded" side={2} />
      </mesh>
    </group>
  );
}

function SaxonHuts() {
  return (
    <group>
      <House position={[12, 0, 8]} scale={0.7} />
      <House position={[-4, 0, 2]} scale={0.55} />
      <House position={[18, 0, -6]} scale={0.6} />
      <Palisade rx={INNER_RX * 0.55} rz={INNER_RZ * 0.55} />
    </group>
  );
}

function Rubble() {
  const piles: [number, number, number, number][] = [
    [westWallPoint[0] + 6, 0.9, westWallPoint[2], 3],
    [westWallPoint[0] + 4, 0.7, westWallPoint[2] - 16, 2.4],
    [southTowerPoint[0], 0.8, southTowerPoint[2] - 6, 2.6],
    [-30, 0.6, 20, 2.2],
    [places.hall[0], 0.5, places.hall[2], 2.8],
  ];
  return (
    <group>
      {piles.map(([x, y, z, s], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0.4, index, 0.2]}>
          <dodecahedronGeometry args={[s, 0]} />
          <Tint color="#8a7362" />
        </mesh>
      ))}
      <mesh position={[-16, 0.12, 132]} rotation={[-Math.PI / 2, 0, 0.04]}>
        <planeGeometry args={[170, 12]} />
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
  const saxonScale = phase === "saxon";
  return (
    <GhostScope opacity={ghostOpacity}>
      <Ground />
      <River />
      <RingBank
        rx={saxonScale ? INNER_RX * 0.62 : INNER_RX + 8}
        rz={saxonScale ? INNER_RZ * 0.62 : INNER_RZ + 7}
        height={saxonScale ? 1.5 : 3.2}
        confidence={saxonScale ? "inferred" : "excavated"}
      />
      <RingDitch
        rx={saxonScale ? INNER_RX * 0.78 : INNER_RX + 20}
        rz={saxonScale ? INNER_RZ * 0.78 : INNER_RZ + 16}
        width={saxonScale ? 8 : 16}
      />
      {!saxonScale && <Courtyard />}
      {saxonScale && <SaxonHuts />}
      <Barrow />
      {phase === "timber" && (
        <>
          <Palisade rx={INNER_RX - 1} rz={INNER_RZ - 1} gate />
          <Causeway timber />
          <Block position={places.hall} size={[10, 4.6, 18]} confidence="inferred" roofKind="thatch" />
        </>
      )}
      {walled && phase !== "timber" && (
        <>
          <Curtain era={era} />
          <Causeway />
          {phase !== "demolition" && <PosternArch />}
          <Halls era={era} />
        </>
      )}
      {phase !== "saxon" && phase !== "demolition" && phase !== "ruin" && <Town />}
      {phase !== "saxon" && phase !== "demolition" && (
        <OuterWard broken={phase === "ruin"} />
      )}
      {phase !== "saxon" && <Fort />}
      {era === "siege" && (
        <>
          <Priory />
          <SiegeCamp />
        </>
      )}
      {era === "civilwar" && <CivilWar />}
      {(era === "orchard" || era === "demolition") && (
        <Trees count={era === "orchard" ? 22 : 8} spread={[120, 96]} />
      )}
      {phase === "demolition" && <Rubble />}
    </GhostScope>
  );
}
