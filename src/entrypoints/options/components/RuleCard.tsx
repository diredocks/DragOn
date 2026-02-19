import dino from "@/assets/dino.svg";
import { dragController } from "@/shared/controller/drag";
import { pattern } from "@/shared/utils/pattern";
import type { Point, Vector } from "@/shared/utils/type";
import { PatternThumbnail, PopupBox } from "./index";

type RulePanelProps = {
  pattern: Vector[];
  onPatternChange: (pattern: Vector[]) => void;
};

export function RuleCard(props: RulePanelProps) {
  let canvasRef!: HTMLCanvasElement;
  let canvasContext: CanvasRenderingContext2D;

  const clearCanvas = () => {
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
  };

  const handleDragStart = (buf: DragEvent[]) => {
    const rect = canvasRef.getBoundingClientRect();
    canvasRef.width = canvasRef.offsetWidth;
    canvasRef.height = canvasRef.offsetHeight;
    canvasContext.lineCap = "round";
    canvasContext.lineJoin = "round";
    // TODO: Follow Config
    canvasContext.lineWidth = 10;
    canvasContext.strokeStyle = "oklch(76.8% 0.233 130.85)";

    const first = buf.shift()!;
    const last = buf[buf.length - 1] || first;
    canvasContext.setTransform(1, 0, 0, 1, -rect.x, -rect.y);
    canvasContext.beginPath();
    canvasContext.moveTo(first.clientX, first.clientY);
    canvasContext.stroke();
    canvasContext.beginPath();
    canvasContext.moveTo(last.clientX, last.clientY);
  };

  const handleDragUpdate = (_buf: DragEvent[], e: DragEvent) => {
    canvasContext.lineTo(e.clientX, e.clientY);
    canvasContext.stroke();
    canvasContext.beginPath();
    canvasContext.moveTo(e.clientX, e.clientY);

    const point: Point = [e.clientX, e.clientY];
    pattern.addPoint(point);
  };

  const handleDragEnd = () => {
    clearCanvas();

    props.onPatternChange(pattern.pattern);
    pattern.clear();
  };

  const handleDragAbort = () => {
    clearCanvas();
  };

  const onPopupOpen = () => {
    canvasContext = canvasRef.getContext("2d")!;
    dragController.enable();
    dragController.addEventListener("start", handleDragStart);
    dragController.addEventListener("update", handleDragUpdate);
    dragController.addEventListener("end", handleDragEnd);
    dragController.addEventListener("abort", handleDragAbort);
  };

  const onPopupClose = () => {
    dragController.disable();
    dragController.removeEventListener("start", handleDragStart);
    dragController.removeEventListener("update", handleDragUpdate);
    dragController.removeEventListener("end", handleDragEnd);
    dragController.removeEventListener("abort", handleDragAbort);
  };

  return (
    <PopupBox
      title="Edit Rule"
      trigger={
        <li class="flex aspect-4/5 cursor-pointer flex-col rounded-sm border border-outline bg-white transition-all duration-300 hover:shadow-sm">
          <PatternThumbnail
            pattern={props.pattern}
            showAnimation={true}
            viewBox={100}
          />
        </li>
      }
      onOpen={onPopupOpen}
      onClose={onPopupClose}
    >
      <div class="flex max-w-200 flex-wrap gap-5">
        <div class="group relative aspect-square grow-20 basis-81.25 rounded-sm border-2 border-gray-200 border-dashed">
          <canvas
            ref={canvasRef}
            class="pointer-events-none relative z-1 h-full w-full"
          />
          <div class="absolute top-0 left-0 box-border block h-full w-full p-[10%] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <a
              href="https://en.wikipedia.org/wiki/Dinosaur_Game"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block"
            >
              <img src={dino} alt="Dino illustration" class="mb-3 p-4" />
            </a>

            <p class="mb-1 text-xl">If you serious you lose</p>

            <p class="text-gray-500">
              Zhang ZhengKai (born 2002), professionally known as jackzebra and
              under many other monikers, such as jackapplepeople, zeb, and{" "}
              <a
                href="https://genius.com/artists/Jackzebra"
                target="_blank"
                rel="noopener noreferrer"
                class="text-accent"
              >
                孙龙潭
              </a>
              , is a Chinese recording artist from Shanghai and based in
              Chengdu, Sichuan.{" "}
            </p>
          </div>
          <div class="pointer-events-none absolute top-0 left-0 box-border block h-full w-full p-[10%] opacity-100 transition-opacity duration-300 group-hover:opacity-0">
            <PatternThumbnail
              pattern={props.pattern}
              showAnimation={false}
              viewBox={150}
            />
          </div>
        </div>
        <div class="flex min-w-0 grow basis-62.5 flex-col gap-10">
          <div class="group block">
            <span>Command</span>
            <p class="text-sm opacity-50 transition-opacity duration-300 group-hover:opacity-100">
              Choose a command that should be assigned to this gesture.
            </p>
          </div>
          <div class="group block">
            <span>Label (optional)</span>
            <p class="text-sm opacity-50 transition-opacity duration-300 group-hover:opacity-100">
              Assign a custom name that will be displayed instead of the command
              name.
            </p>
          </div>
          <button
            type="button"
            class="mt-auto cursor-pointer rounded-sm bg-accent px-0.5 py-1.25 text-content-inverse outline-accent"
          >
            Save
          </button>
        </div>
      </div>
    </PopupBox>
  );
}
