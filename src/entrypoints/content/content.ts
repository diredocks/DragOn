import { ProtocolMap, sendMessage } from "@/entrypoints/shared/utils/messaging";
import { dragController } from "@/entrypoints/shared/controller/drag";
import { selectController } from "@/entrypoints/shared/controller/select";
import { Context } from "@/entrypoints/shared/models/context";

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
  const priority: (keyof ProtocolMap)[] = ['Text', 'Link', 'Image'];
  for (let action of priority) {
    if (await sendMessage(action, ctx)) break; // action success
  }
}
