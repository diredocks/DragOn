// TODO: Flip and scale animation

import type { Action } from "@/shared/models/action";
import { Rule } from "@/shared/models/rule";
import { rulesStorage } from "@/shared/settings/storage";
import type { Vector } from "@/shared/utils/type";
import {
  ActionSettings,
  PopupBox,
  RightDrawer,
  RuleCard,
  RuleEditor,
} from "../components";

const [rules, setRules] = createStore<Rule[]>([]);

type EditorState =
  | { type: "closed" }
  | { type: "creating"; selectedAction: Action<unknown> | null }
  | { type: "editing"; index: number; selectedAction: Action<unknown> | null };

export function Rules() {
  const [editor, setEditor] = createSignal<EditorState>({ type: "closed" });
  const [visibleAction, setVisibleAction] =
    createSignal<Action<unknown> | null>(null);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    const serializedRules = await rulesStorage.getValue();
    setRules(await Promise.all(serializedRules.map((r) => Rule.fromJSON(r))));
    setIsLoading(false);
  });

  const unwatch = rulesStorage.watch(async (newRules) => {
    setRules(await Promise.all(newRules.map((r) => Rule.fromJSON(r))));
  });
  onCleanup(unwatch);

  createEffect(() => {
    if (!isLoading()) {
      const serializedRules = rules.map((r) => r.toJSON());
      rulesStorage.setValue(serializedRules);
    }
  });

  const isEditorOpen = () => editor().type !== "closed";
  const isCreating = () => editor().type === "creating";

  const editorRule = (): Rule | null => {
    const state = editor();
    if (state.type === "closed") return null;
    if (state.type === "creating") return new Rule([], []);
    return rules[state.index];
  };

  const selectedAction = () => {
    const state = editor();
    return state.type !== "closed" ? state.selectedAction : null;
  };

  const openCreator = () =>
    setEditor({ type: "creating", selectedAction: null });
  const openEditor = (index: number) =>
    setEditor({ type: "editing", index, selectedAction: null });
  const selectAction = (action: Action<unknown> | null) => {
    const state = editor();
    if (state.type !== "closed") {
      setEditor({ ...state, selectedAction: action });
    }
  };
  const closeEditor = () => setEditor({ type: "closed" });

  createEffect(() => {
    const action = selectedAction();
    if (action) {
      // Sync visibleAction with selectedAction, but keep it during close animation
      setVisibleAction(action);
    }
  });

  const handleSave = (rule: Rule) => {
    if (rule.actions.length === 0 || rule.pattern.length === 0) return;
    const state = editor();
    if (state.type === "creating") {
      setRules(rules.length, rule);
    } else if (state.type === "editing") {
      setRules(state.index, rule);
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
            onClick={openCreator}
            class="h-full w-full cursor-pointer text-outline transition-all duration-300 hover:text-accent"
          >
            {i18n.t("rules.new")}
          </button>
        </li>
        <Index each={rules}>
          {(_each, index) => (
            <RuleCard
              pattern={rules[index].pattern as Vector[]}
              onSelect={() => openEditor(index)}
              onDelete={handleDelete(index)}
            />
          )}
        </Index>
      </ul>

      <PopupBox
        title={isCreating() ? i18n.t("rules.new") : i18n.t("rules.edit")}
        isOpen={isEditorOpen()}
        onClose={closeEditor}
      >
        <RuleEditor
          isOpen={isEditorOpen()}
          rule={editorRule()}
          onSave={handleSave}
          selectedAction={selectedAction()}
          onSelectAction={selectAction}
        />
      </PopupBox>

      <RightDrawer
        isOpen={selectedAction() !== null}
        onClose={() => selectAction(null)}
        onAfterClose={() => setVisibleAction(null)}
      >
        <ActionSettings
          action={visibleAction()}
          onSave={() => selectAction(null)}
        />
      </RightDrawer>
    </>
  );
}
