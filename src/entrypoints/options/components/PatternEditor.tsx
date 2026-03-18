import dino from "@/assets/dino.svg";
import { dragController } from "@/shared/controller/drag";
import { pattern } from "@/shared/utils/pattern";
import type { Point, Vector } from "@/shared/utils/type";
import { PatternThumbnail } from "./PatternThumbnail";

type PatternEditorProps = {
  value: Vector[];
  onChange: (pattern: Vector[]) => void;
};

type ViewState = "guide" | "preview" | "drawing";

export function PatternEditor(props: PatternEditorProps) {
  let canvasRef!: HTMLCanvasElement;
  let canvasContext: CanvasRenderingContext2D;

  const [viewState, setViewState] = createSignal<ViewState>("guide");

  const hasPattern = createMemo(() => props.value.length > 0);
  const shouldShowGuide = createMemo(() => viewState() === "guide");
  const shouldShowPreview = createMemo(() => viewState() === "preview");

  const updateViewState = (
    event: "reset" | "enter" | "leave" | "draw-start" | "draw-end" | "draw-abort",
  ) => {
    const next = (() => {
      const has = hasPattern();
      const current = viewState();

      switch (event) {
        case "reset":
          return has ? "preview" : "guide";
        case "draw-start":
          return "drawing";
        case "draw-end":
        case "draw-abort":
          return has ? "preview" : "guide";
        case "enter":
          if (!has) return "guide";
          return current === "drawing" ? "drawing" : "guide";
        case "leave":
          if (!has) return "guide";
          return current === "drawing" ? "drawing" : "preview";
      }
    })();

    if (viewState() !== next) {
      setViewState(next);
    }
  };

  createEffect(() => {
    const has = props.value.length > 0;
    setViewState(has ? "preview" : "guide");
  });

  const clearCanvas = () => {
    canvasContext.setTransform(1, 0, 0, 1, 0, 0);
    canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
  };

  const handleDragStart = (buf: DragEvent[]) => {
    updateViewState("draw-start");
    const rect = canvasRef.getBoundingClientRect();
    canvasRef.width = canvasRef.offsetWidth;
    canvasRef.height = canvasRef.offsetHeight;
    canvasContext.lineCap = "round";
    canvasContext.lineJoin = "round";
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
    props.onChange(pattern.pattern);
    pattern.clear();
    updateViewState("draw-end");
  };

  const handleDragAbort = () => {
    clearCanvas();
    updateViewState("draw-abort");
  };

  onMount(() => {
    canvasContext = canvasRef.getContext("2d")!;
    dragController.addEventListener("start", handleDragStart);
    dragController.addEventListener("update", handleDragUpdate);
    dragController.addEventListener("end", handleDragEnd);
    dragController.addEventListener("abort", handleDragAbort);
  });

  onCleanup(() => {
    dragController.removeEventListener("start", handleDragStart);
    dragController.removeEventListener("update", handleDragUpdate);
    dragController.removeEventListener("end", handleDragEnd);
    dragController.removeEventListener("abort", handleDragAbort);
  });

  return (
    <div
      class="group relative aspect-square w-full rounded-sm border-2 border-gray-200 border-dashed sm:w-lg sm:shrink-0"
      onmouseenter={() => {
        dragController.enable();
        updateViewState("enter");
      }}
      onmouseleave={() => {
        dragController.disable();
        updateViewState("leave");
      }}
    >
      <canvas
        ref={canvasRef}
        class="pointer-events-none relative z-1 h-full w-full"
      />

      <div
        class="absolute top-0 left-0 box-border block h-full w-full p-[10%] transition-opacity duration-300"
        classList={{
          "opacity-0": !shouldShowGuide(),
          "opacity-100": shouldShowGuide(),
        }}
      >
        <a
          href="https://en.wikipedia.org/wiki/Dinosaur_Game"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block"
        >
          <img src={dino} alt={i18n.t("rules.pattern.dinoAlt")} class="mb-3 p-4" />
        </a>

        <p class="mb-1 text-xl">{i18n.t("rules.pattern.title")}</p>

        <p class="text-gray-500">
          {i18n.t("rules.pattern.description")}
          <a href="/" class="text-accent">
            {i18n.t("rules.pattern.link")}
          </a>
          {i18n.t("rules.pattern.descriptionEnd")}
        </p>
      </div>

      <div
        class="pointer-events-none absolute top-0 left-0 box-border block h-full w-full p-[10%] transition-opacity duration-300"
        classList={{
          "opacity-100": shouldShowPreview(),
          "opacity-0": !shouldShowPreview(),
        }}
      >
        <PatternThumbnail
          pattern={props.value}
          showAnimation={false}
          viewBox={150}
        />
      </div>
    </div>
  );
}
