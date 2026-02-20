import type { Vector } from "@/shared/utils/type";
import { PopupBox, RuleCard, RuleEditor } from "../components";

const [patterns, setPatterns] = createStore([[[0, 1]], [[1, 0]], [[-1, 0]]]);

export function Rules() {
  const [selectedIndex, setSelectedIndex] = createSignal<number | null>(null);

  const selectedPattern = () => {
    const idx = selectedIndex();
    return idx !== null ? patterns[idx] : null;
  };

  return (
    <>
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
          {(_each, index) => (
            <RuleCard
              pattern={patterns[index] as Vector[]}
              onSelect={() => setSelectedIndex(index)}
            />
          )}
        </Index>
      </ul>

      <PopupBox
        title="Edit Rule"
        isOpen={selectedIndex() !== null}
        onClose={() => setSelectedIndex(null)}
      >
        <RuleEditor
          isOpen={selectedIndex() !== null}
          pattern={(selectedPattern() as Vector[]) || null}
          onPatternChange={(newPattern) => {
            const idx = selectedIndex();
            if (idx !== null) {
              setPatterns(idx, newPattern);
            }
          }}
        />
      </PopupBox>
    </>
  );
}
