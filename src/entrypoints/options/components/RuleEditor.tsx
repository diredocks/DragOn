import dino from "@/assets/dino.svg";
import { dragController } from "@/shared/controller/drag";
import type { Action } from "@/shared/models/action";
import { Rule } from "@/shared/models/rule";
import { pattern } from "@/shared/utils/pattern";
import type { Point, Vector } from "@/shared/utils/type";
import { ActionSelector, PatternThumbnail, SettingItem } from "./index";

type RuleEditorProps = {
  isOpen: boolean;
  rule: Rule | null;
  onSave: (rule: Rule) => void;
  selectedActionId: string | null;
  onSelectAction: (id: string | null) => void;
};

type EditorViewState = "guide" | "preview" | "drawing";

export function RuleEditor(props: RuleEditorProps) {
  let canvasRef!: HTMLCanvasElement;
  let canvasContext: CanvasRenderingContext2D;

  const [draftPattern, setDraftPattern] = createSignal<Vector[]>([]);
  const [draftActions, setDraftActions] = createSignal<Action<unknown>[]>([]);
  const [viewState, setViewState] = createSignal<EditorViewState>("guide");

  const hasPattern = createMemo(() => draftPattern().length > 0);
  const shouldShowGuide = createMemo(() => viewState() === "guide");
  const shouldShowPreview = createMemo(() => viewState() === "preview");

  const updateViewState = (
    event:
      | "reset"
      | "enter"
      | "leave"
      | "draw-start"
      | "draw-end"
      | "draw-abort",
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

  createEffect((prevIsOpen) => {
    if (props.isOpen && !prevIsOpen) {
      setDraftPattern(props.rule?.pattern ?? []);
      setDraftActions(props.rule?.actions ?? []);
      updateViewState("reset");
    }
    return props.isOpen;
  }, false);

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
    setDraftPattern(pattern.pattern);
    pattern.clear();
    updateViewState("draw-end");
  };

  const handleDragAbort = () => {
    clearCanvas();
    updateViewState("draw-abort");
  };

  const initEditor = () => {
    canvasContext = canvasRef.getContext("2d")!;
    dragController.addEventListener("start", handleDragStart);
    dragController.addEventListener("update", handleDragUpdate);
    dragController.addEventListener("end", handleDragEnd);
    dragController.addEventListener("abort", handleDragAbort);
  };

  const cleanupEditor = () => {
    dragController.removeEventListener("start", handleDragStart);
    dragController.removeEventListener("update", handleDragUpdate);
    dragController.removeEventListener("end", handleDragEnd);
    dragController.removeEventListener("abort", handleDragAbort);
  };

  createEffect(() => {
    if (props.isOpen) {
      initEditor();
    } else {
      cleanupEditor();
    }
  });

  return (
    <div class="flex max-w-200 flex-wrap gap-5">
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
            <img src={dino} alt="Dino illustration" class="mb-3 p-4" />
          </a>

          <p class="mb-1 text-xl">Drag the elements here</p>

          <p class="text-gray-500">
            Drag the image, selected text, or{" "}
            <a href="/" class="text-accent">
              a link
            </a>{" "}
            here. We’ll generate the matching pattern for this rule.
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
            pattern={draftPattern()}
            showAnimation={false}
            viewBox={150}
          />
        </div>
      </div>

      <div class="flex min-w-0 flex-1 basis-50 flex-col gap-10">
        <div class="group block">
          <SettingItem
            name="Actions"
            description="A sequence of custom actions executed in order."
          />
          <ActionSelector
            actions={draftActions()}
            onChange={setDraftActions}
            selectedId={props.selectedActionId}
            onSelect={props.onSelectAction}
          />
        </div>
        <button
          type="button"
          onClick={() =>
            props.onSave(new Rule(draftPattern(), draftActions()))
          }
          class="mt-auto cursor-pointer rounded-sm bg-accent px-0.5 py-1.25 text-content-inverse outline-accent"
        >
          Save
        </button>
      </div>
    </div>
  );
}
