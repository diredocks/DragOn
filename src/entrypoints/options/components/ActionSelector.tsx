import {
  Action,
  type ActionSerialized,
  type ActionType,
} from "@/shared/models/action";
import { ActionDropdown } from "./ActionDropdown";
import { SortableItem } from "./SortableItem";

type ActionSelectorProps = {
  actions: Action<unknown>[];
  selected: Action<unknown> | null;
  onChange: (actions: Action<unknown>[]) => void;
  onSelect: (action: Action<unknown> | null) => void;
};

const actionModules = import.meta.glob(
  "/src/entrypoints/background/actions/**/*.ts",
);

const ALL_ACTIONS: ActionSerialized[] = Object.keys(actionModules).map(
  (path) => {
    const match = path.match(/\/actions\/(\w+)\/(\w+)\.ts$/);
    if (!match) throw new Error(`Invalid action path: ${path}`);
    const [, type, name] = match;
    return { type: type as ActionType, name };
  },
);

export function ActionSelector(props: ActionSelectorProps) {
  const [open, setOpen] = createSignal(false);
  const [keyword, setKeyword] = createSignal("");
  const [drag, setDrag] = createSignal<{
    from: number | null;
    over: number | null;
  }>({ from: null, over: null });

  const results = createMemo(() => {
    const kw = keyword().toLowerCase();
    return ALL_ACTIONS.filter(
      (a) =>
        !props.actions.some((e) => e.type === a.type && e.name === a.name) &&
        `${a.type}.${a.name}`.toLowerCase().includes(kw),
    );
  });

  const addAction = async (item: ActionSerialized) => {
    const action = await Action.fromJSON(item);
    if (!await action.requestPermissions()) return;

    props.onChange([...props.actions, action]);
    setKeyword("");
    setOpen(false);
  };

  const removeAction = (action: Action<unknown>) => {
    props.onChange(props.actions.filter((a) => a !== action));
    if (props.selected === action) props.onSelect(null);
  };

  const handleDrop = (index: number) => {
    const { from } = drag();
    if (from !== null && from !== index) {
      const items = [...props.actions];
      const [moved] = items.splice(from, 1);
      items.splice(index, 0, moved);
      props.onChange(items);
    }
    setDrag({ from: null, over: null });
  };

  return (
    <div class="relative w-full">
      <div class="flex max-h-64 flex-col rounded-sm border border-outline-light bg-white">
        <div class="flex flex-col gap-1 overflow-y-auto p-1">
          <For each={props.actions}>
            {(action, i) => (
              <SortableItem
                label={action.toString()}
                index={i()}
                isActive={props.selected === action}
                dragState={drag()}
                onActive={() => props.onSelect(action)}
                onRemove={() => removeAction(action)}
                onDragStart={(idx) => setDrag((p) => ({ ...p, from: idx }))}
                onDragOver={(idx) => setDrag((p) => ({ ...p, over: idx }))}
                onDrop={handleDrop}
                onDragEnd={() => setDrag({ from: null, over: null })}
              />
            )}
          </For>
          <input
            class="w-full px-2 py-1 text-sm outline-0"
            type="search"
            placeholder={i18n.t("rules.actions.searchPlaceholder")}
            value={keyword()}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onInput={(e) => {
              setKeyword(e.currentTarget.value);
              setOpen(true);
            }}
          />
        </div>
      </div>
      <Show when={open() && results().length > 0}>
        <ActionDropdown results={results()} onSelect={addAction} />
      </Show>
    </div>
  );
}
