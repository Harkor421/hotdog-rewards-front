import * as THREE from "three";

/**
 * Every texture on this hot dog is generated here, in the browser, from noise.
 *
 * No image files. Partly because a bun is exactly the kind of surface value
 * noise is good at — irregular, soft-edged, self-similar at two scales — and
 * partly because the alternative is shipping megabytes of JPEG for one mesh
 * and hoping a CDN answers before the first paint. Nothing here can 404.
 *
 * The maps are tileable: the noise lattice wraps at the tile size, so the
 * bread has no seam where the UVs repeat.
 */

/** Deterministic value noise on a wrapping lattice. */
function makeNoise(seed: number) {
  const hash = (x: number, y: number) => {
    let h = x * 374761393 + y * 668265263 + seed * 2147483647;
    h = (h ^ (h >>> 13)) * 1274126177;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);

  /** `period` makes the lattice wrap, which is what keeps the tile seamless. */
  return function noise(x: number, y: number, period: number) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const w = (n: number) => ((n % period) + period) % period;
    const v00 = hash(w(xi), w(yi));
    const v10 = hash(w(xi + 1), w(yi));
    const v01 = hash(w(xi), w(yi + 1));
    const v11 = hash(w(xi + 1), w(yi + 1));
    const sx = smooth(xf);
    const sy = smooth(yf);
    return (v00 * (1 - sx) + v10 * sx) * (1 - sy) + (v01 * (1 - sx) + v11 * sx) * sy;
  };
}

function fbm(noise: ReturnType<typeof makeNoise>, x: number, y: number, base: number, octaves: number) {
  let sum = 0;
  let amp = 0.5;
  let freq = base;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise(x * freq, y * freq, freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

type Painter = (u: number, v: number, n: number, fine: number) => [number, number, number];

function paint(size: number, seed: number, baseFreq: number, painter: Painter): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  const noise = makeNoise(seed);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const n = fbm(noise, u, v, baseFreq, 5);
      const fine = fbm(noise, u + 11.3, v + 7.1, baseFreq * 5, 3);
      const [r, g, b] = painter(u, v, n, fine);
      const i = (y * size + x) * 4;
      img.data[i] = r;
      img.data[i + 1] = g;
      img.data[i + 2] = b;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function toTexture(canvas: HTMLCanvasElement, repeat: [number, number], srgb: boolean) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.needsUpdate = true;
  return t;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export type HotDogTextures = ReturnType<typeof buildTextures>;

export function buildTextures(size = 512) {
  // ---- the bun -----------------------------------------------------------
  // Two things sell baked bread: the colour has to drift between a pale crumb
  // and a toasted crust over a few centimetres, and the surface has to be
  // bumpy at a much finer scale than that colour drifts. So the albedo rides
  // the low-frequency octaves and the bump map rides the high ones.
  const bunColor = paint(size, 7, 4, (u, v, n, fine) => {
    const bake = clamp01(n * 1.15 + fine * 0.18 - 0.1);
    const r = lerp(226, 168, bake);
    const g = lerp(178, 104, bake);
    const b = lerp(112, 54, bake);
    // flour dusting: rare, bright, small
    const dust = fine > 0.82 ? (fine - 0.82) * 3.4 : 0;
    return [
      clamp01(r / 255 + dust * 0.25) * 255,
      clamp01(g / 255 + dust * 0.25) * 255,
      clamp01(b / 255 + dust * 0.22) * 255,
    ];
  });

  const bunBump = paint(size, 7, 14, (_u, _v, n, fine) => {
    const h = clamp01(n * 0.55 + fine * 0.6) * 255;
    return [h, h, h];
  });

  const bunRough = paint(size, 21, 6, (_u, _v, n, fine) => {
    // crust is duller than crumb; the fine octave stops it reading as plastic
    const r = clamp01(0.72 + n * 0.22 + fine * 0.1) * 255;
    return [r, r, r];
  });

  // ---- the sausage -------------------------------------------------------
  // A casing is smooth, faintly mottled, and marked where it touched the
  // grill. The bands run across the texture's V, which after the capsule's
  // own UVs land as rings around the sausage — which is where grill marks go.
  const dogColor = paint(size, 3, 7, (_u, v, n, fine) => {
    const mottle = n * 0.35 + fine * 0.2;
    let r = lerp(178, 128, mottle);
    let g = lerp(74, 44, mottle);
    let b = lerp(56, 36, mottle);
    // char bands, softened at the edges so they read as scorch, not paint
    const band = Math.abs(Math.sin(v * Math.PI * 9 + n * 1.4));
    if (band > 0.93) {
      const strength = (band - 0.93) / 0.07;
      r = lerp(r, 62, strength * 0.85);
      g = lerp(g, 28, strength * 0.85);
      b = lerp(b, 22, strength * 0.85);
    }
    return [r, g, b];
  });

  const dogBump = paint(size, 3, 18, (_u, v, n, fine) => {
    const band = Math.abs(Math.sin(v * Math.PI * 9 + n * 1.4));
    const groove = band > 0.93 ? (band - 0.93) / 0.07 : 0;
    const h = clamp01(0.5 + fine * 0.3 - groove * 0.45) * 255;
    return [h, h, h];
  });

  const dogRough = paint(size, 5, 9, (_u, _v, n, fine) => {
    // glossy where it is fatty, duller where it charred
    const r = clamp01(0.26 + n * 0.3 + fine * 0.12) * 255;
    return [r, r, r];
  });

  // ---- the sauces --------------------------------------------------------
  // Barely-there roughness variation. Mustard is not a mirror, but a perfectly
  // uniform one reads as extruded plastic under a moving light.
  const sauceRough = paint(size, 13, 22, (_u, _v, n, fine) => {
    const r = clamp01(0.14 + n * 0.2 + fine * 0.14) * 255;
    return [r, r, r];
  });

  return {
    bunColor: toTexture(bunColor, [2.4, 2.4], true),
    bunBump: toTexture(bunBump, [2.4, 2.4], false),
    bunRough: toTexture(bunRough, [2.4, 2.4], false),
    dogColor: toTexture(dogColor, [1, 1], true),
    dogBump: toTexture(dogBump, [1, 1], false),
    dogRough: toTexture(dogRough, [1, 1], false),
    sauceRough: toTexture(sauceRough, [6, 1], false),
    dispose() {
      for (const t of [
        this.bunColor, this.bunBump, this.bunRough,
        this.dogColor, this.dogBump, this.dogRough, this.sauceRough,
      ]) t.dispose();
    },
  };
}
