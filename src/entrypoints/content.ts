import { sendMessage } from "./utils/messaging";
import { dragController } from "./controller/drag";
import { selectController } from "./controller/select";
import { Context } from "./models/context";

export default defineContentScript({
  matches: ['<all_urls>'],
  allFrames: true,
  runAt: 'document_start',
  main() {
    dragController.enable();
    dragController.addEventListener('end', handleDragEnd);
    selectController.enable();
    selectController.addEventListener('end', () => { selectedText = window.getSelection()?.toString() ?? ""; })
    selectController.addEventListener('abort', () => { selectedText = window.getSelection()?.toString() ?? ""; })
  },
});

let selectedText: string;

const handleDragEnd = async (buf: DragEvent[]) => {
  const ctx = new Context(buf, selectedText);

  if (ctx.selectedText) {
    sendMessage('Search', ctx.selectedText);
    return;
  } else if (ctx.dropText) {
    sendMessage('Search', ctx.dropText);
    return;
  }

  if (ctx.link) {
    sendMessage('Open', ctx.link);
    return;
  }

  if (ctx.img) {
    sendMessage('Download', ctx.img);
    return;
  }
}
