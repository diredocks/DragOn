import type { HSV, Point, RGB, RGBA, Vector } from "./type";

export function getDistance(x: Point, y: Point) {
  return Math.hypot(y[0] - x[0], y[1] - x[1]);
}

export function vectorDirectionDifference(V1: Vector, V2: Vector): number {
  let angleDifference = Math.atan2(V1[0], V1[1]) - Math.atan2(V2[0], V2[1]);

  if (angleDifference > Math.PI) {
    angleDifference -= 2 * Math.PI;
  } else if (angleDifference <= -Math.PI) {
    angleDifference += 2 * Math.PI;
  }

  return angleDifference / Math.PI;
}

export const isEditableOrDraggable = (el: Element | null): boolean => {
  if (!el) return false;

  // input / textarea
  const input = el.closest<HTMLInputElement | HTMLTextAreaElement>(
    'input:not([type="hidden"]):not([disabled]), textarea:not([disabled])',
  );
  if (input) return true;

  // contenteditable
  const editable = el.closest<HTMLElement>(
    '[contenteditable=""], [contenteditable="true"]',
  );
  if (editable) return true;

  // draggable
  const draggable = el.closest<HTMLElement>('[draggable="true"]');
  if (draggable) {
    // ignore link / image / video
    for (const ignoreSelector of ["a[href]", "img", "video"]) {
      if (
        draggable.closest(ignoreSelector) ||
        draggable.querySelector(ignoreSelector)
      )
        return false;
    }
    return true;
  }

  const onDrop = el.hasAttribute("ondrop");
  if (onDrop) return true;

  return false;
};

export const nextTabIndex = async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  return tab.index;
};

export const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export function RGBAToHex([r, g, b, a]: RGBA): string {
  return (
    "#" +
    [r, g, b, Math.round(clamp(a, 0, 1) * 255)]
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function HexToRGBA(hex: string): RGBA {
  if (hex.startsWith("#")) hex = hex.slice(1);

  const value = parseInt(hex.padEnd(8, "f"), 16);

  return [
    (value >> 24) & 255,
    (value >> 16) & 255,
    (value >> 8) & 255,
    Math.round(((value & 255) / 255) * 100) / 100,
  ];
}

export function RGBToHSV([r, g, b]: RGB | RGBA): HSV {
  const _r = clamp(r, 0, 255) / 255;
  const _g = clamp(g, 0, 255) / 255;
  const _b = clamp(b, 0, 255) / 255;

  const max = Math.max(_r, _g, _b);
  const min = Math.min(_r, _g, _b);
  const delta = max - min;

  let h = 0;

  if (delta !== 0) {
    switch (max) {
      case _r:
        h = ((_g - _b) / delta) % 6;
        break;
      case _g:
        h = (_b - _r) / delta + 2;
        break;
      default:
        h = (_r - _g) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return [h, s, v];
}

export function HSVToRGB([h, s, v]: HSV): RGB {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 1);
  v = clamp(v, 0, 1);

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}
