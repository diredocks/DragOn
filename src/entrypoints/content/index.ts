import { onMessageTab, ProtocolMap, sendMessage } from "@/entrypoints/shared/utils/messaging";
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

onMessageTab('clipboardWriteText', m => {
  navigator.clipboard.writeText(m.data);
})

const fetchImage = async (link: string) => {
  const response = await fetch(link);
  const mimeType = response.headers.get("Content-Type");
  let blob: Blob;

  if (mimeType === "image/png") {
    blob = await response.blob();
  } else {
    // convert from other formats to PNG
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // CORS
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = link;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);
    blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/png"),
    );
  }

  return blob;
}

onMessageTab('clipboardWriteImage', async (m) => {
  const blob = await fetchImage(m.data);
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
  return true;
})
