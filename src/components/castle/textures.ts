import * as THREE from "three";

export type TextureKind =
  | "stone"
  | "grass"
  | "timber"
  | "thatch"
  | "roof"
  | "water"
  | "earth"
  | "plaster"
  | "asphalt"
  | "iron";

function canvasTexture(
  draw: (context: CanvasRenderingContext2D, size: number) => void,
  size = 256,
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create a texture");
  draw(context, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function noise(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function makeTextures() {
  const stone = canvasTexture((context, size) => {
    context.fillStyle = "#a8643a";
    context.fillRect(0, 0, size, size);
    const courses = 8;
    const courseH = size / courses;
    for (let row = 0; row < courses; row++) {
      const offset = row % 2 === 0 ? 0 : 28;
      for (let x = -28; x < size; x += 52) {
        const shade = 90 + noise(x, row) * 70;
        context.fillStyle = `rgb(${shade + 70}, ${shade * 0.55}, ${shade * 0.32})`;
        context.fillRect(x + offset + 2, row * courseH + 2, 48, courseH - 4);
      }
    }
  });
  stone.repeat.set(0.35, 0.35);

  const grass = canvasTexture((context, size) => {
    context.fillStyle = "#5f7a42";
    context.fillRect(0, 0, size, size);
    for (let i = 0; i < 1400; i++) {
      const x = noise(i, 2) * size;
      const y = noise(3, i) * size;
      const shade = 70 + noise(i, i) * 50;
      context.fillStyle = `rgba(${shade}, ${shade + 30}, ${shade * 0.4}, 0.45)`;
      context.fillRect(x, y, 2, 3 + noise(i, 8) * 4);
    }
  });
  grass.repeat.set(0.08, 0.08);

  const timber = canvasTexture((context, size) => {
    context.fillStyle = "#6a4328";
    context.fillRect(0, 0, size, size);
    for (let x = 0; x < size; x += 28) {
      context.fillStyle = x % 56 === 0 ? "#54341c" : "#7a5132";
      context.fillRect(x, 0, 24, size);
      context.strokeStyle = "rgba(30,16,8,0.35)";
      context.beginPath();
      context.moveTo(x + 8, 0);
      context.lineTo(x + 10, size);
      context.stroke();
    }
  });
  timber.repeat.set(0.4, 0.25);

  const thatch = canvasTexture((context, size) => {
    context.fillStyle = "#b4975c";
    context.fillRect(0, 0, size, size);
    context.strokeStyle = "rgba(90,60,20,0.45)";
    for (let y = 0; y < size; y += 6) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(size, y + 2);
      context.stroke();
    }
  });
  thatch.repeat.set(0.5, 0.5);

  const roof = canvasTexture((context, size) => {
    context.fillStyle = "#6a3832";
    context.fillRect(0, 0, size, size);
    for (let row = 0; row < 10; row++) {
      const y = row * (size / 10);
      const offset = row % 2 ? 16 : 0;
      for (let x = -16; x < size; x += 32) {
        context.fillStyle = row % 3 === 0 ? "#7d433c" : "#5c302c";
        context.fillRect(x + offset, y + 1, 30, size / 10 - 3);
      }
    }
  });
  roof.repeat.set(0.6, 0.6);

  const water = canvasTexture((context, size) => {
    const gradient = context.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, "#3f727c");
    gradient.addColorStop(1, "#2a515c");
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    context.strokeStyle = "rgba(210,230,230,0.25)";
    for (let y = 8; y < size; y += 18) {
      context.beginPath();
      context.moveTo(0, y);
      context.bezierCurveTo(40, y - 4, 80, y + 4, size, y);
      context.stroke();
    }
  });
  water.repeat.set(0.15, 0.15);

  const earth = canvasTexture((context, size) => {
    context.fillStyle = "#7a5a3c";
    context.fillRect(0, 0, size, size);
    for (let i = 0; i < 700; i++) {
      context.fillStyle = `rgba(50,30,16,${0.15 + noise(i, 4) * 0.3})`;
      context.fillRect(noise(i, 1) * size, noise(i, 9) * size, 8, 5);
    }
  });
  earth.repeat.set(0.2, 0.2);

  const plaster = canvasTexture((context, size) => {
    context.fillStyle = "#e4e2dc";
    context.fillRect(0, 0, size, size);
    for (let i = 0; i < 400; i++) {
      context.fillStyle = `rgba(120,116,108,${noise(i, 5) * 0.15})`;
      context.fillRect(noise(i, 2) * size, noise(i, 6) * size, 3, 2);
    }
  });
  plaster.repeat.set(0.25, 0.25);

  const asphalt = canvasTexture((context, size) => {
    context.fillStyle = "#3c3f43";
    context.fillRect(0, 0, size, size);
    for (let i = 0; i < 900; i++) {
      context.fillStyle = `rgba(20,20,22,${noise(i, 3) * 0.4})`;
      context.fillRect(noise(i, 7) * size, noise(i, 11) * size, 2, 2);
    }
  });
  asphalt.repeat.set(0.12, 0.12);

  const iron = canvasTexture((context, size) => {
    context.fillStyle = "#4a4e52";
    context.fillRect(0, 0, size, size);
    context.strokeStyle = "#6a7074";
    context.strokeRect(8, 8, size - 16, size - 16);
  });

  return { stone, grass, timber, thatch, roof, water, earth, plaster, asphalt, iron };
}

export type TextureSet = ReturnType<typeof makeTextures>;
