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

const handleDragEnd = async (_buf: DragEvent[], _e: DragEvent, startEle: Element) => {
  const rawTarget = _buf[0].target;

  const hitEl =
    rawTarget instanceof Text
      ? rawTarget.parentElement
      : rawTarget instanceof Element
        ? rawTarget
        : null;

  const semanticEl = startEle instanceof Text
    ? startEle.parentElement
    : startEle;

  const link =
    hitEl?.closest('a')?.href ??
    semanticEl?.closest('a')?.href;

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

  if (selectedText || startEle.nodeType === Node.TEXT_NODE) {
    let searchText = selectedText?.trim();

    // dirty hack for bilibili comments
    if (!searchText) {
      searchText =
        semanticEl?.textContent ||
        semanticEl
          ?.querySelector('bili-rich-text')
          ?.shadowRoot
          ?.querySelector('#contents')
          ?.textContent ||
        '';
    }

    if (searchText != '') {
      sendMessage('Search', searchText);
      return;
    }
  }
}
