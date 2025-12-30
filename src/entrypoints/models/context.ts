export class Context {
  public img?: string;
  public link?: string;
  public dropText?: string;
  public selectedText?: string;

  constructor(endBuffer: DragEvent[], selectedText: string) {
    const first = endBuffer[0];
    const last = endBuffer[endBuffer.length - 1];
    const rawTarget = first?.target;

    const hitEl =
      rawTarget instanceof Text
        ? rawTarget.parentElement
        : rawTarget instanceof Element
          ? rawTarget
          : null;

    const start = first?.composedPath()?.[0];

    const semanticEl =
      start instanceof Text
        ? start.parentElement
        : start instanceof Element
          ? start
          : null;

    const selectionEl =
      window.getSelection()?.anchorNode?.parentElement ?? null;

    this.link =
      hitEl?.closest('a')?.href ??
      semanticEl?.closest('a')?.href;
    this.img =
      hitEl?.closest('img')?.src ??
      semanticEl?.closest('img')?.src;
    this.dropText =
      last?.dataTransfer?.getData('text');

    // selectedText is valid only if it comes from the same element
    // that started the drag, which avoids using unrelated page selections.
    if (selectedText && semanticEl && semanticEl.contains(selectionEl)) {
      this.selectedText = selectedText;
    }

    // keep dropped text only when it represents plain text.
    // if it’s a URL (or missing), ignore it to avoid false positives.
    if (selectedText && this.dropText && !URL.canParse(this.dropText)) {
      // keep dropText
    } else {
      // FIXME: what if dropText is URL?
      this.dropText = undefined;
    }
  }
}
