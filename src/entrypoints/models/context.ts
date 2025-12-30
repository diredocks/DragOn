export class Context {
  #hitEl: Element | null;
  #semanticEl: Element | null;
  #selectionEl: Element | null;

  #img?: string;
  #link?: string;
  #dropText?: string;
  #selectedText?: string;

  constructor(endBuffer: DragEvent[], selectedText: string) {
    this.#selectedText = selectedText;

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
