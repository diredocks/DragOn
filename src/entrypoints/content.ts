import { sendMessage } from "./utils/messaging";
import { dragController } from "./controller/drag";
import { selectController } from "./controller/select";

export default defineContentScript({
  matches: ['<all_urls>'],
  allFrames: true,
  runAt: 'document_start',
  main() {
    dragController.enable();
    dragController.addEventListener('end', handleDragEnd);
    selectController.enable();
    selectController.addEventListener('end', () => { selectedText = window.getSelection()?.toString(); })
    selectController.addEventListener('abort', () => { selectedText = window.getSelection()?.toString(); })
  },
});

let selectedText: string | undefined;

const handleDragEnd = async (_buf: DragEvent[], _e: DragEvent, startPath: EventTarget[]) => {
  const rawTarget = _buf[0].target;
  const startEle = startPath[0] as Element;

  const hitEl =
    rawTarget instanceof Text
      ? rawTarget.parentElement
      : rawTarget instanceof Element
        ? rawTarget
        : null;

  const semanticEl = startEle instanceof Text
    ? startEle.parentElement
    : startEle;

  const selectionEl = window.getSelection()?.anchorNode?.parentElement;

  const link =
    hitEl?.closest('a')?.href ??
    semanticEl?.closest('a')?.href;

  if (selectedText && selectionEl && semanticEl?.contains(selectionEl)) {
    sendMessage('Search', selectedText);
    return;
  } else if (
    selectedText &&
    (semanticEl?.textContent.includes(selectedText)
      || selectedText.includes(semanticEl!.textContent)
      || semanticEl?.id === "content") // if semanticEl is selection
    && startPath.includes(semanticEl!) // if start from semanticEl
    && hitEl?.nodeName === "BILI-COMMENTS" // dirty hack for bilibili comments
  ) {
    sendMessage('Search', selectedText);
    return;
  }

  if (link) {
    sendMessage('Open', link);
    return;
  }

  const img =
    hitEl?.closest('img')?.src ??
    semanticEl?.closest('img')?.src;

  if (img) {
    sendMessage('Download', img);
    return;
  }
}
