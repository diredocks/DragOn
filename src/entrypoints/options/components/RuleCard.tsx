import type { Vector } from "@/shared/utils/type";
import { PatternThumbnail, PopupBox } from "./index";

type RulePanelProps = {
  pattern: Vector[];
  onPatternChange: (pattern: Vector[]) => void;
};

export function RuleCard(props: RulePanelProps) {
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
    >
      <div class="flex flex-wrap gap-5">
        <div class="relative aspect-square grow-20 basis-81.25 cursor-crosshair rounded-sm border-2 border-gray-200 border-dashed">
          <canvas class="pointer-events-none relative z-1 h-full w-full"></canvas>
          <div class="absolute top-0 left-0 box-border block h-full w-full p-[10%]">
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
