// TODO: Flip and scale animation

import { Rule } from "@/shared/models/rule";
import { rulesStorage } from "@/shared/settings/storage";
import type { Vector } from "@/shared/utils/type";
import { PopupBox, RightDrawer, RuleCard, RuleEditor } from "../components";

const [rules, setRules] = createStore<Rule[]>([]);
const NEW_RULE_INDEX = -1;

export function Rules() {
  const [selectedIndex, setSelectedIndex] = createSignal<number | null>(null);
  const [selectedActionId, setSelectedActionId] = createSignal<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = createSignal(true);

  // Load rules from storage on mount
  onMount(async () => {
    const serializedRules = await rulesStorage.getValue();
    setRules(serializedRules.map((r) => Rule.fromJSON(r)));
    setIsLoading(false);
  });

  // Watch for external storage changes
  onMount(() => {
    const unwatch = rulesStorage.watch((newRules) => {
      setRules(newRules.map((r) => Rule.fromJSON(r)));
    });
    return unwatch;
  });

  // Save rules to storage when they change
  createEffect(() => {
    if (!isLoading()) {
      const serializedRules = rules.map((r) => r.toJSON());
      rulesStorage.setValue(serializedRules);
    }
  });

  createEffect(() => {
    selectedIndex();
    setSelectedActionId(null);
  });

  const isCreating = () => selectedIndex() === NEW_RULE_INDEX;
  const isEditorOpen = () => selectedIndex() !== null;

  const selectedRule = (): Rule | null => {
    const idx = selectedIndex();
    if (idx === null || idx === NEW_RULE_INDEX) return null;
    return rules[idx];
  };

  const editorRule = (): Rule | null => {
    if (isCreating()) {
      return new Rule([], []);
    }
    return selectedRule();
  };

  const closeEditor = () => {
    setSelectedIndex(null);
    setSelectedActionId(null);
  };

  const handleSave = (rule: Rule) => {
    if (isCreating()) {
      // Add new rule
      setRules(rules.length, rule);
    } else {
      // Update existing rule
      const idx = selectedIndex();
      if (idx !== null && idx >= 0) {
        setRules(idx, rule);
      }
    }
    closeEditor();
  };

  const handleDelete = (index: number) => (e: Event) => {
    e.stopPropagation();
    setRules((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <ul class="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-5">
        <li class="aspect-4/5 rounded-sm border-[3px] border-outline border-dashed transition-all duration-300 hover:border-accent">
          <button
            type="button"
            onClick={() => setSelectedIndex(NEW_RULE_INDEX)}
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
              onDelete={handleDelete(index)}
            />
          )}
        </Index>
      </ul>

      <PopupBox
        title={isCreating() ? "New Rule" : "Edit Rule"}
        isOpen={isEditorOpen()}
        onClose={closeEditor}
      >
        <RuleEditor
          isOpen={isEditorOpen()}
          rule={editorRule()}
          onSave={handleSave}
          selectedActionId={selectedActionId()}
          onSelectAction={setSelectedActionId}
        />
      </PopupBox>

      <RightDrawer
        isOpen={selectedActionId() !== null}
        onClose={() => setSelectedActionId(null)}
      />
    </>
  );
}
