import { dragController } from "@/shared/controller/drag";
import { selectController } from "@/shared/controller/select";
import { Context } from "@/shared/models/context";
import { exclusionsStorage } from "@/shared/settings/storage";
import { onMessageTab, sendMessage } from "@/shared/utils/messaging";
import { pattern } from "@/shared/utils/pattern";
import type { Point } from "@/shared/utils/type";
import { interactionOverlay } from "./view/interaction-overlay";

export default defineContentScript({
  matches: ["<all_urls>"],
  allFrames: true,
  runAt: "document_start",
  async main() {
    dragController.addEventListener("start", handleDragStart);
    dragController.addEventListener("update", handleDragUpdate);
    dragController.addEventListener("end", handleDragEnd);
    dragController.addEventListener("abort", handleDragAbort);
    selectController.addEventListener("end", updateSelection);
    selectController.addEventListener("abort", updateSelection);

    const isExcluded = (patterns: string[]) =>
      patterns.some((p) => new URLPattern(p).test(window.location.href));
    const applyState = (patterns: string[]) => {
      setControllers(isExcluded(patterns));
    };

    applyState(await exclusionsStorage.getValue());
    exclusionsStorage.watch(applyState);
  },
});

const setControllers = (disable: boolean) => {
  const method = disable ? "disable" : "enable";
  dragController[method]();
  selectController[method]();
};

let selectedText: string;

const updateSelection = async () => {
  selectedText = window.getSelection()?.toString() ?? "";
};

const updateDrag = async (buf: DragEvent[], e: DragEvent) => {
  const point: Point = [e.clientX, e.clientY];
  interactionOverlay.updateTrace(point);
  pattern.addPoint(point);

  const ctx = new Context(buf, selectedText);
  const matchedAction = await sendMessage("dragUpdate", {
    ctx,
    pattern: pattern.pattern,
  });
  interactionOverlay.updateAction(matchedAction);
};

const clearDrag = () => {
  interactionOverlay.terminate();
  pattern.clear();
};

const handleDragStart = async (buf: DragEvent[], e: DragEvent) => {
  interactionOverlay.initialize([e.clientX, e.clientY]);
  updateDrag(buf, e);
};

const handleDragUpdate = async (buf: DragEvent[], e: DragEvent) => {
  updateDrag(buf, e);
};

const handleDragEnd = async (buf: DragEvent[]) => {
  const ctx = new Context(buf, selectedText);
  sendMessage("dragEnd", { ctx, pattern: pattern.pattern });
  clearDrag();
};

const handleDragAbort = async () => {
  clearDrag();
};

onMessageTab("clipboardWriteText", (m) => {
  navigator.clipboard.writeText(m.data);
});

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
};

onMessageTab("clipboardWriteImage", async (m) => {
  const blob = await fetchImage(m.data);
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
  return true;
});
