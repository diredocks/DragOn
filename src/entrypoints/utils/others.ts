export const isEditableOrDraggable = (el: Element | null): boolean => {
  while (el) {
    // input / textarea
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      return !el.disabled && el.type !== "hidden";
    }

    // contenteditable
    if (el instanceof HTMLElement && el.isContentEditable) return true;

    // draggable elements
    if (el instanceof HTMLElement && el.draggable) {
      // don't abort when dragging link or images
      if (el instanceof HTMLAnchorElement && el.href) return false;
      if (el instanceof HTMLImageElement) return false;
      // abort when dragging other draggable elements
      return true;
    }

    el = el.parentElement;
  }
  return false;
};
