import { actions } from "@/entrypoints/background/actions";
import type { RuleSerialized } from "@/shared/models/rule";
import type { Vector } from "@/shared/utils/type";
import { PopupBox, RuleCard, RuleEditor } from "../components";

const rulesRaw = [];
for (const i of [-1, 0, 1]) {
  for (const j of [-1, 0, 1]) {
    if (i === 0 && j === 0) continue;
    rulesRaw.push({
      pattern: [[i, j]],
      actions: [
        new actions.text.Search({ engine: "bing" }).toJSON(),
        new actions.link.Open().toJSON(),
        new actions.image.Copy().toJSON(),
      ],
    });
  }
}

const [rules, setRules] = createStore(rulesRaw);

export function Rules() {
  const [selectedIndex, setSelectedIndex] = createSignal<number | null>(null);

  const selectedRule = () => {
    const idx = selectedIndex();
    return idx !== null ? rules[idx] : null;
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
        <Index each={rules}>
          {(_each, index) => (
            <RuleCard
              pattern={rules[index].pattern as Vector[]}
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
          rule={selectedRule() as RuleSerialized}
          onPatternChange={(newPattern) => {
            const idx = selectedIndex();
            if (idx !== null) {
              setRules(idx, "pattern", newPattern);
            }
          }}
        />
      </PopupBox>
    </>
  );
}
