"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { BAILEY_D, BAILEY_W, HD, HW, type Confidence } from "@/content/site";
import { Mat, Tint } from "@/components/castle/materials";

export function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[40, -0.05, 0]} receiveShadow>
      <planeGeometry args={[780, 620]} />
      <Mat kind="grass" evidenceAware={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

export function River() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0.08]} position={[-168, -0.35, 10]}>
        <planeGeometry args={[70, 520]} />
        <Mat kind="water" evidenceAware={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[-128, -0.3, 30]}>
        <planeGeometry args={[28, 360]} />
        <Mat kind="water" evidenceAware={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Courtyard() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]} receiveShadow>
      <planeGeometry args={[BAILEY_W - 2, BAILEY_D - 2]} />
      <Mat kind="grass" confidence="excavated" side={THREE.DoubleSide} />
    </mesh>
  );
}

export function Ramparts({ height }: { height: number }) {
  const thick = 14;
  const y = height / 2;
  const runs: [number, number, number, number, number, number][] = [
    [0, y, -HD - thick / 2, BAILEY_W, height, thick],
    [0, y, HD + thick / 2, BAILEY_W, height, thick],
    [HW + thick / 2, y, 0, thick, height, BAILEY_D + thick * 2],
    [-HW - thick / 2, y, 0, thick, height, BAILEY_D + thick * 2],
  ];
  return (
    <group>
      {runs.map((run, index) => (
        <mesh key={index} position={[run[0], run[1], run[2]]} receiveShadow>
          <boxGeometry args={[run[3], run[4], run[5]]} />
          <Mat kind="earth" confidence="excavated" />
        </mesh>
      ))}
    </group>
  );
}

export function Moat({ scale = 1 }: { scale?: number }) {
  const thick = 14;
  const ditch = 20 * scale;
  const northZ = -HD - thick - 3 - ditch / 2;
  const southZ = HD + thick + 3 + ditch / 2;
  const eastX = HW + thick + 3 + ditch / 2;
  const span = BAILEY_W + thick * 2 + ditch;
  const depthSpan = BAILEY_D + thick * 2 + 6;
  return (
    <group>
      <mesh position={[0, -2.4, northZ]}>
        <boxGeometry args={[span, 0.35, ditch]} />
        <Mat kind="water" confidence="excavated" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -2.4, southZ]}>
        <boxGeometry args={[span, 0.35, ditch]} />
        <Mat kind="water" confidence="excavated" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[eastX, -2.4, 0]}>
        <boxGeometry args={[ditch, 0.35, depthSpan]} />
        <Mat kind="water" confidence="excavated" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-eastX, -2.4, 0]}>
        <boxGeometry args={[ditch, 0.35, depthSpan]} />
        <Mat kind="water" confidence="excavated" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function Causeway({ timber = false }: { timber?: boolean }) {
  const length = timber ? 22 : 40;
  return (
    <mesh position={[0, 0.2, -HD - 8 - length / 2]} castShadow receiveShadow>
      <boxGeometry args={[timber ? 4.5 : 8, 0.55, length]} />
      <Mat
        kind={timber ? "timber" : "earth"}
        confidence={timber ? "inferred" : "documented"}
      />
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

export function Palisade({ width, depth }: { width: number; depth: number }) {
  const posts = useMemo(() => {
    const points: { x: number; z: number }[] = [];
    const edges = [
      [-width / 2, -depth / 2, width / 2, -depth / 2],
      [width / 2, -depth / 2, width / 2, depth / 2],
      [width / 2, depth / 2, -width / 2, depth / 2],
      [-width / 2, depth / 2, -width / 2, -depth / 2],
    ];
    for (const [x1, z1, x2, z2] of edges) {
      const length = Math.hypot(x2 - x1, z2 - z1);
      const steps = Math.floor(length / 0.85);
      for (let step = 0; step < steps; step++) {
        const t = step / steps;
        points.push({ x: x1 + (x2 - x1) * t, z: z1 + (z2 - z1) * t });
      }
    }
    return points;
  }, [width, depth]);
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
      if (Math.abs(x) < 22 && Math.abs(z + 6) < 18) continue;
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
