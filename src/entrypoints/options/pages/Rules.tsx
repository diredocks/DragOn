import type { Vector } from "@/shared/utils/type";
import { RuleCard } from "../components";

const [patterns, setPatterns] = createStore([[[0, 1]], [[1, 0]], [[-1, 0]]]);

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
        {(each, index) => (
          <RuleCard
            pattern={each() as Vector[]}
            onPatternChange={(newPattern) => setPatterns(index, newPattern)}
          />
        )}
      </Index>
    </ul>
  );
}
