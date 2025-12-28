// import { sendMessage } from './utils/messaging';

import { dragController } from "./controller/drag";

export default defineContentScript({
  matches: ['<all_urls>'],
  allFrames: true,
  runAt: 'document_start',
  main() {
    // document.addEventListener('dragstart', dragStartHandler, { capture: false });
    // document.addEventListener('dragover', dragOverHandler, { capture: false });
    // document.addEventListener('dragend', dragEndHandler, { capture: false });
    // document.addEventListener('drop', dropHandler, { capture: false });
    // document.addEventListener('selectionchange', selectionHandler, { capture: false });

    dragController.enable();
    dragController.addEventListener('register', () => { console.log("Registered"); });
    dragController.addEventListener('start', () => { console.log("Started"); });
    dragController.addEventListener('update', () => { console.log("Updated"); });
    dragController.addEventListener('end', () => { console.log("Ended"); });
    dragController.addEventListener('abort', () => { console.log("Aborted"); });
  },
});

// let currentElement: Element;
// let currentTextSelection: string;
//
// const dragStartHandler = async (e: DragEvent) => {
//   currentElement = e.composedPath()[0] as Element;
// }
//
// const selectionHandler = async () => {
//   currentTextSelection = document.getSelection()!.toString();
// }
//
// const dragOverHandler = async (e: DragEvent) => {
//   const target = e.composedPath()[0] as Element;
//   if (target instanceof HTMLInputElement
//     || target instanceof HTMLTextAreaElement) {
//     return;
//   }
//   if (!e.altKey) e.preventDefault();
// }
//
// const dragEndHandler = async (e: DragEvent) => {
//   if (!e.altKey) e.preventDefault();
// }
//
// const dropHandler = async (e: Event) => {
//   const target = e.composedPath()[0] as Element;
//   if (target instanceof HTMLInputElement
//     || target instanceof HTMLTextAreaElement) {
//     return;
//   }
//
//   if (currentTextSelection &&
//     (currentElement?.nodeType === Node.TEXT_NODE
//       || currentElement instanceof HTMLInputElement
//       || currentElement instanceof HTMLTextAreaElement
//       || currentElement.contains(document.getSelection()!.anchorNode))
//   ) {
//     // Search Text
//     sendMessage('Search', currentTextSelection);
//     return;
//   }
//   // Open link or download image
//   const link =
//     // First we find link in child
//     currentElement.querySelector("a")?.href
//     // Then we find link to parent
//     ?? currentElement.closest("a")?.href;
//   const img = currentElement.parentElement?.querySelector("img")?.src;
//   if (link) sendMessage('Open', link);
//   if (img) sendMessage('Download', img);
// }
