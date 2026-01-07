import { Point, Vector } from "./type";

export function getDistance(x: Point, y: Point) {
  return Math.hypot(y[0] - x[0], y[1] - x[1]);
}

export function vectorDirectionDifference(V1: Vector, V2: Vector): number {
  let angleDifference =
    Math.atan2(V1[0], V1[1]) - Math.atan2(V2[0], V2[1]);

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
    'input:not([type="hidden"]):not([disabled]), textarea:not([disabled])'
  );
  if (input) return true;

  // contenteditable
  const editable = el.closest<HTMLElement>('[contenteditable=""], [contenteditable="true"]');
  if (editable) return true;

  // draggable
  const draggable = el.closest<HTMLElement>('[draggable="true"]');
  if (draggable) {
    // ignore link / image / video
    for (const ignoreSelector of ['a[href]', 'img', 'video']) {
      if (draggable.closest(ignoreSelector)
        || draggable.querySelector(ignoreSelector))
        return false;
    }
    return true;
  }

  const onDrop = el.hasAttribute('ondrop');
  if (onDrop) return true;

  return false;
};

export const nextTabIndex = async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  return tab.index;
};
