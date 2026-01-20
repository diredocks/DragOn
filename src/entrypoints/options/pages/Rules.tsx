import type { Vector } from "@/shared/utils/type";
import { PatternThumbnail } from "../components";

const patterns = [[[0, 1]], [[1, 0]], [[-1, 0]]];

export function Rules() {
  return (
    <ul class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
      <li class="aspect-4/5 rounded-sm border-[3px] border-outline border-dashed transition-all duration-300 hover:border-accent">
        <button
          type="button"
          class="h-full w-full cursor-pointer text-outline transition-all duration-300 hover:text-accent"
        >
          New Rule
        </button>
      </li>
      <Index each={patterns}>
        {(each) => (
          <li class="flex aspect-4/5 cursor-pointer flex-col rounded-sm border border-outline bg-white transition-all duration-300 hover:shadow-sm">
            <PatternThumbnail pattern={each() as Vector[]} />
          </li>
        )}
      </Index>
    </ul>
  );
}
