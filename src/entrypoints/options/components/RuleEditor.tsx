import type { Action } from "@/shared/models/action";
import { Rule } from "@/shared/models/rule";
import type { Vector } from "@/shared/utils/type";
import {
  ActionSelector,
  PatternEditor,
  SettingItem,
} from "./index";

type RuleEditorProps = {
  isOpen: boolean;
  rule: Rule | null;
  onSave: (rule: Rule) => void;
  selectedActionId: string | null;
  onSelectAction: (id: string | null) => void;
};

export function RuleEditor(props: RuleEditorProps) {
  const [draftPattern, setDraftPattern] = createSignal<Vector[]>([]);
  const [draftActions, setDraftActions] = createSignal<Action<unknown>[]>([]);

  createEffect((prevIsOpen) => {
    if (props.isOpen && !prevIsOpen) {
      setDraftPattern(props.rule?.pattern ?? []);
      setDraftActions(props.rule?.actions ?? []);
    }
    return props.isOpen;
  }, false);

  return (
    <div class="flex max-w-200 flex-wrap gap-5">
      <PatternEditor
        value={draftPattern()}
        onChange={setDraftPattern}
      />

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
