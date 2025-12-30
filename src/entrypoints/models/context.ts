export class Context {
  #hitEl: Element | null;
  #semanticEl: Element | null;
  #selectionEl: Element | null;

  #img?: string;
  #link?: string;
  #dropText?: string;
  #selectedText?: string;

  constructor(endBuffer: DragEvent[], selectedText: string) {
    const first = endBuffer[0];
    const last = endBuffer[endBuffer.length - 1];

    const rawTarget = first?.target;

    this.#hitEl =
      rawTarget instanceof Text
        ? rawTarget.parentElement
        : rawTarget instanceof Element
          ? rawTarget
          : null;

    const start = first?.composedPath()?.[0];

    this.#semanticEl =
      start instanceof Text
        ? start.parentElement
        : start instanceof Element
          ? start
          : null;

    this.#selectionEl =
      window.getSelection()?.anchorNode?.parentElement ?? null;

    this.#link =
      this.#hitEl?.closest('a')?.href ??
      this.#semanticEl?.closest('a')?.href;

    this.#img =
      this.#hitEl?.closest('img')?.src ??
      this.#semanticEl?.closest('img')?.src;

    this.#dropText =
      last?.dataTransfer?.getData('text');

    // selectedText is valid only if it comes from the same element
    // that started the drag, which avoids using unrelated page selections.
    if (selectedText && this.#semanticEl && this.#semanticEl.contains(this.#selectionEl)) {
      this.#selectedText = selectedText;
    }

    // keep dropped text only when it represents plain text.
    // if it’s a URL (or missing), ignore it to avoid false positives.
    if (selectedText && this.#dropText && !URL.canParse(this.#dropText)) {
      // keep dropText
    } else {
      // FIXME: what if dropText is URL?
      this.#dropText = undefined;
    }
  }

  get hitEl() {
    return this.#hitEl;
  }

  get semanticEl() {
    return this.#semanticEl;
  }

  get selectionEl() {
    return this.#selectionEl;
  }

  get link() {
    return this.#link;
  }

  get img() {
    return this.#img;
  }

  get dropText() {
    return this.#dropText;
  }

  get selectedText() {
    return this.#selectedText;
  }
}
