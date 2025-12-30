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
  if (!draggable) return false;

  // ignore link / image / video
  for (const ignoreSelector of ['a[href]', 'img', 'video']) {
    if (draggable.closest(ignoreSelector)
      || draggable.querySelector(ignoreSelector))
      return false;
  }

  return true;
};
