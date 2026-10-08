"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { GATE_ANGLE, INNER_RX, INNER_RZ, onRing } from "@/content/plan";
import { type Confidence } from "@/content/site";
import { Mat, Tint } from "@/components/castle/materials";

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[16, -0.05, 36]} receiveShadow>
      <planeGeometry args={[860, 720]} />
      <Mat kind="grass" evidenceAware={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

const riverCourse: [number, number][] = [
  [-158, -190],
  [-142, -110],
  [-128, -30],
  [-138, 50],
  [-152, 140],
  [-164, 210],
];

export function River() {
  return (
    <group>
      {riverCourse.slice(0, -1).map(([x, z], index) => {
        const [x2, z2] = riverCourse[index + 1];
        const dx = x2 - x;
        const dz = z2 - z;
        const length = Math.hypot(dx, dz) + 8;
        const rotation = Math.atan2(dx, dz);
        return (
          <mesh
            key={index}
            rotation={[-Math.PI / 2, 0, rotation]}
            position={[(x + x2) / 2, 0.02, (z + z2) / 2]}
          >
            <planeGeometry args={[index === 1 ? 36 : 26, length]} />
            <Mat kind="water" evidenceAware={false} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

export function useEllipseGeometry(rx: number, rz: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, rx, rz, 0, Math.PI * 2, false, 0);
    const geometry = new THREE.ShapeGeometry(shape, 48);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }, [rx, rz]);
}

export function Courtyard({ rx = INNER_RX - 3, rz = INNER_RZ - 3 }: { rx?: number; rz?: number }) {
  const geometry = useEllipseGeometry(rx, rz);
  return (
    <mesh geometry={geometry} position={[0, 0.06, 0]} receiveShadow>
      <Mat kind="grass" confidence="excavated" side={THREE.DoubleSide} />
    </mesh>
  );
}

export type RingSegment = {
  x: number;
  z: number;
  length: number;
  rotation: number;
  angle: number;
};

export function ringSegments(
  rx: number,
  rz: number,
  count: number,
  center: [number, number] = [0, 0],
): RingSegment[] {
  const segments: RingSegment[] = [];
  for (let index = 0; index < count; index += 1) {
    const a0 = (index / count) * Math.PI * 2;
    const a1 = ((index + 1) / count) * Math.PI * 2;
    const [x0, z0] = onRing(a0, rx, rz);
    const [x1, z1] = onRing(a1, rx, rz);
    const dx = x1 - x0;
    const dz = z1 - z0;
    segments.push({
      x: (x0 + x1) / 2 + center[0],
      z: (z0 + z1) / 2 + center[1],
      length: Math.hypot(dx, dz) + 1.1,
      rotation: Math.atan2(-dz, dx),
      angle: (a0 + a1) / 2,
    });
  }
  return segments;
}

export function RingBank({
  rx,
  rz,
  height,
  thickness = 12,
  center = [0, 0],
  confidence = "excavated",
}: {
  rx: number;
  rz: number;
  height: number;
  thickness?: number;
  center?: [number, number];
  confidence?: Confidence;
}) {
  const segments = useMemo(
    () => ringSegments(rx, rz, 28, center),
    [center, rx, rz],
  );
  return (
    <group>
      {segments.map((segment, index) => (
        <mesh
          key={index}
          position={[segment.x, height / 2, segment.z]}
          rotation={[0, segment.rotation, 0]}
          receiveShadow
        >
          <boxGeometry args={[segment.length, height, thickness]} />
          <Mat kind="earth" confidence={confidence} />
        </mesh>
      ))}
    </group>
  );
}

export function RingDitch({
  rx,
  rz,
  width = 16,
  center = [0, 0],
  from,
  to,
}: {
  rx: number;
  rz: number;
  width?: number;
  center?: [number, number];
  from?: number;
  to?: number;
}) {
  const segments = useMemo(() => {
    return ringSegments(rx, rz, 32, center).filter((segment) => {
      if (from === undefined || to === undefined) return true;
      return segment.angle >= from && segment.angle <= to;
    });
  }, [center, from, rx, rz, to]);
  return (
    <group>
      {segments.map((segment, index) => (
        <mesh
          key={index}
          position={[segment.x, 0.08, segment.z]}
          rotation={[0, segment.rotation, 0]}
        >
          <boxGeometry args={[segment.length, 0.35, width]} />
          <Mat kind="water" confidence="excavated" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

export function Causeway({ timber = false }: { timber?: boolean }) {
  const length = timber ? 20 : 36;
  const [gx, gz] = onRing(GATE_ANGLE);
  const dirX = Math.sin(GATE_ANGLE);
  const dirZ = -Math.cos(GATE_ANGLE);
  const rotation = Math.atan2(-dirZ, dirX);
  return (
    <mesh
      position={[gx + dirX * (length / 2 + 3), 0.25, gz + dirZ * (length / 2 + 3)]}
      rotation={[0, rotation, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, 0.55, timber ? 4.5 : 8]} />
      <Mat kind={timber ? "timber" : "earth"} confidence={timber ? "inferred" : "documented"} />
    </mesh>
  );
}

type WallSpec = {
  x: number;
  z: number;
  length: number;
  rotation: number;
  height: number;
  confidence: Confidence;
};

export function Wall({ spec }: { spec: WallSpec }) {
  return (
    <mesh
      position={[spec.x, spec.height / 2, spec.z]}
      rotation={[0, spec.rotation, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[spec.length, spec.height, 2.7]} />
      <Mat kind="stone" confidence={spec.confidence} />
    </mesh>
  );
}

export function Merlons({ spec }: { spec: WallSpec }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = Math.max(2, Math.floor(spec.length / 2.3));
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let index = 0; index < count; index++) {
      const along = -spec.length / 2 + 1.1 + index * (spec.length / count);
      const x = spec.x + Math.cos(spec.rotation) * along;
      const z = spec.z - Math.sin(spec.rotation) * along;
      dummy.position.set(x, spec.height + 0.45, z);
      dummy.rotation.set(0, spec.rotation, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [count, spec]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} castShadow>
      <boxGeometry args={[0.85, 0.9, 2.9]} />
      <Mat kind="stone" confidence={spec.confidence} />
    </instancedMesh>
  );
}

export function Tower({
  position,
  radius,
  height,
  confidence,
  broken = false,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  confidence: Confidence;
  broken?: boolean;
}) {
  const h = broken ? height * 0.45 : height;
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 1.06, h, 14]} />
        <Mat kind="stone" confidence={confidence} />
      </mesh>
      {!broken && (
        <mesh position={[0, h + 0.35, 0]} castShadow>
          <cylinderGeometry args={[radius + 0.35, radius + 0.15, 0.7, 14]} />
          <Mat kind="stone" confidence={confidence} />
        </mesh>
      )}
    </group>
  );
}

export function useRoofGeometry(width: number, depth: number, rise: number) {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-depth / 2, 0);
    shape.lineTo(0, rise);
    shape.lineTo(depth / 2, 0);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: width,
      bevelEnabled: false,
    });
    geometry.translate(0, 0, -width / 2);
    geometry.rotateY(Math.PI / 2);
    geometry.computeVertexNormals();
    return geometry;
  }, [width, depth, rise]);
}

export function Roof({
  width,
  depth,
  rise,
  y,
  kind = "roof",
  confidence = "documented",
}: {
  width: number;
  depth: number;
  rise: number;
  y: number;
  kind?: "roof" | "thatch";
  confidence?: Confidence;
}) {
  const geometry = useRoofGeometry(width, depth, rise);
  return (
    <mesh geometry={geometry} position={[0, y, 0]} castShadow>
      <Mat kind={kind} confidence={confidence} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function Block({
  position,
  size,
  confidence,
  roof = true,
  roofKind = "roof",
  ruin = false,
  cutaway = false,
}: {
  position: [number, number, number];
  size: [number, number, number];
  confidence: Confidence;
  roof?: boolean;
  roofKind?: "roof" | "thatch";
  ruin?: boolean;
  cutaway?: boolean;
}) {
  const [w, h, d] = size;
  if (cutaway) {
    const wall = 0.45;
    return (
      <group position={position}>
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <boxGeometry args={[w, 0.16, d]} />
          <Mat kind="timber" confidence={confidence} />
        </mesh>
        {[
          [0, h / 2, -d / 2, w, h, wall],
          [-w / 2, h / 2, 0, wall, h, d],
          [w / 2, h / 2, 0, wall, h, d],
        ].map((piece, index) => (
          <mesh key={index} position={[piece[0], piece[1], piece[2]]} castShadow>
            <boxGeometry args={[piece[3], piece[4], piece[5]]} />
            <Mat kind="stone" confidence={confidence} />
          </mesh>
        ))}
        <mesh position={[-w / 4, h / 2, d / 2]}>
          <boxGeometry args={[w / 2.2, h, wall]} />
          <Mat kind="stone" confidence={confidence} />
        </mesh>
        <mesh position={[w / 4, h / 2, d / 2]}>
          <boxGeometry args={[w / 2.2, h, wall]} />
          <Mat kind="stone" confidence={confidence} />
        </mesh>
      </group>
    );
  }
  return (
    <group position={position}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <Mat kind={roofKind === "thatch" && ruin ? "timber" : "stone"} confidence={confidence} />
      </mesh>
      {roof && !ruin && !cutaway && (
        <Roof width={w + 0.6} depth={d + 0.8} rise={h * 0.42} y={h} kind={roofKind} confidence={confidence} />
      )}
      <mesh position={[0, 1.5, d / 2 + 0.08]}>
        <boxGeometry args={[1.8, 2.8, 0.18]} />
        <Tint color="#2a211c" />
      </mesh>
    </group>
  );
}

export function Palisade({
  rx,
  rz,
  gate = false,
}: {
  rx: number;
  rz: number;
  gate?: boolean;
}) {
  const posts = useMemo(() => {
    const count = Math.max(24, Math.floor((Math.PI * (rx + rz)) / 0.9));
    const points: { x: number; z: number }[] = [];
    for (let index = 0; index < count; index += 1) {
      const angle = (index / count) * Math.PI * 2;
      if (gate && Math.abs(angle - GATE_ANGLE) < 0.16) continue;
      const [x, z] = onRing(angle, rx, rz);
      points.push({ x, z });
    }
    return points;
  }, [gate, rx, rz]);
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    posts.forEach((post, index) => {
      dummy.position.set(post.x, 2.3, post.z);
      dummy.scale.set(1, 0.82 + (index % 5) * 0.06, 1);
      dummy.rotation.set(0, index * 0.2, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [posts]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, posts.length]} castShadow>
      <cylinderGeometry args={[0.16, 0.22, 4.4, 5]} />
      <Mat kind="timber" confidence="inferred" />
    </instancedMesh>
  );
}

export function Trees({
  count,
  spread,
  origin = [0, 0, 0],
}: {
  count: number;
  spread: [number, number];
  origin?: [number, number, number];
}) {
  const trees = useMemo(() => {
    const points: { x: number; z: number; h: number }[] = [];
    for (let index = 0; index < count; index++) {
      const x = origin[0] - spread[0] / 2 + ((index * 47) % spread[0]);
      const z = origin[2] - spread[1] / 2 + ((index * 29) % spread[1]);
      const nx = x / (INNER_RX - 6);
      const nz = z / (INNER_RZ - 6);
      if (nx * nx + nz * nz > 1) continue;
      if (Math.abs(x - 50) < 14 && Math.abs(z - 6) < 18) continue;
      if (Math.abs(x + 24) < 12 && Math.abs(z - 12) < 10) continue;
      points.push({ x, z, h: 3.2 + (index % 4) * 0.7 });
    }
    return points;
  }, [count, origin, spread]);

  return (
    <group>
      {trees.map((tree, index) => (
        <group key={index} position={[tree.x, 0, tree.z]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.18, 0.28, 1.4, 5]} />
            <Mat kind="timber" evidenceAware={false} />
          </mesh>
          <mesh position={[0, 0.7 + tree.h * 0.45, 0]}>
            <coneGeometry args={[1.5, tree.h, 7]} />
            <Mat kind="grass" evidenceAware={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Person({
  position,
  color,
}: {
  position: [number, number, number];
  color: string;
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.95, 0]} castShadow>
        <capsuleGeometry args={[0.28, 0.7, 4, 8]} />
        <Tint color={color} />
      </mesh>
      <mesh position={[0, 1.75, 0]} castShadow>
        <sphereGeometry args={[0.2, 10, 10]} />
        <Tint color="#e4c6aa" />
      </mesh>
    </group>
  );
}

export function House({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <Block
        position={[0, 0, 0]}
        size={[7, 4.2, 5]}
        confidence="inferred"
        roofKind="thatch"
      />
    </group>
  );
}
