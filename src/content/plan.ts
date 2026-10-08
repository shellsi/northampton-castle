// Outline traced from a MOLA plan of Northampton Castle.
// North is -Z, east is +X. Angle 0 is north and increases clockwise.
// The inner bailey is the rounded enclosure; the outer bailey lies south of it.

export const INNER_RX = 72;
export const INNER_RZ = 58;

export const GATE_ANGLE = 0.4;
export const POSTERN_ANGLE = 5.2;
export const SOUTH_ANGLE = 3.36;

export const OUTER_CENTER: [number, number] = [0, 130];
export const OUTER_RX = 78;
export const OUTER_RZ = 48;

export function onRing(angle: number, rx = INNER_RX, rz = INNER_RZ): [number, number] {
  return [Math.sin(angle) * rx, -Math.cos(angle) * rz];
}

export function angDist(a: number, b: number) {
  const raw = Math.abs(a - b) % (Math.PI * 2);
  return Math.min(raw, Math.PI * 2 - raw);
}

/** West wall recorded in 1879: south tower, round the west, to the postern. */
export function inWestArc(angle: number) {
  return angle >= 3.15 && angle <= 5.45;
}

function at(angle: number, y = 0): [number, number, number] {
  const [x, z] = onRing(angle);
  return [x, y, z];
}

export const gatePoint = at(GATE_ANGLE, 4);
export const posternPoint = at(POSTERN_ANGLE, 3);
export const southTowerPoint = at(SOUTH_ANGLE, 0);
export const westWallPoint = at(4.55, 4);

export const places = {
  barrow: [-10, 0, -28] as [number, number, number],
  hall: [50, 0, 6] as [number, number, number],
  hallQuery: [-24, 0, 12] as [number, number, number],
  greatChamber: [40, 0, 2] as [number, number, number],
  longChamber: [62, 0, 6] as [number, number, number],
  queens: [46, 0, -14] as [number, number, number],
  kitchen: [40, 0, 28] as [number, number, number],
  apartments: [56, 0, -22] as [number, number, number],
  chapel: [54, 0, 28] as [number, number, number],
  fort: [10, 0, -112] as [number, number, number],
  outer: [6, 2, 132] as [number, number, number],
  ditch: [22, 2, -82] as [number, number, number],
  river: [-132, 1, 10] as [number, number, number],
  priory: [96, 0, -158] as [number, number, number],
  town: [36, 0, 198] as [number, number, number],
  earthwork: [-4, 2, -6] as [number, number, number],
  station: [-34, 4, 138] as [number, number, number],
  posternToday: [-6, 2, 162] as [number, number, number],
  bankToday: [66, 2, -2] as [number, number, number],
  carPark: [0, 1, 6] as [number, number, number],
  road: [30, 1, 20] as [number, number, number],
};
