import { actions } from "@/entrypoints/background/actions";
import {
  Action,
  type ActionItem,
  type ActionType,
} from "@/shared/models/action";
import { ActionDropdown } from "./ActionDropdown";
import { SortableItem } from "./SortableItem";

type ActionSelectorProps = {
  actions: Action<unknown>[];
  onChange: (actions: Action<unknown>[]) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

const ALL_ACTIONS: ActionItem[] = Object.entries(actions).flatMap(
  ([type, categoryActions]) =>
    Object.entries(categoryActions).map(([name, ActionClass]) => {
      const instance = new ActionClass();
      return {
        id: `${type}.${name}`,
        type: type as ActionType,
        label: instance.toString(),
      };
    }),
);

export function ActionSelector(props: ActionSelectorProps) {
  const [open, setOpen] = createSignal(false);
  const [keyword, setKeyword] = createSignal("");
  const [drag, setDrag] = createSignal<{
    from: number | null;
    over: number | null;
  }>({
    from: null,
    over: null,
  });

  const openDrawer = (id: string) => {
    props.onSelect(id);
  };

  // Convert Action[] to ActionItem[] for display
  const added = createMemo(() =>
    props.actions.map((a) => ({
      id: `${a.type}.${a.name}`,
      type: a.type,
      label: a.toString(),
    })),
  );

  const results = createMemo(() => {
    const kw = keyword().toLowerCase();
    const addedIds = new Set(added().map((a) => a.id));

    const grouped: Record<string, ActionItem[]> = {};
    for (const a of ALL_ACTIONS) {
      if (addedIds.has(a.id)) continue;
      if (
        !a.label.toLowerCase().includes(kw) &&
        !a.id.toLowerCase().includes(kw)
      )
        continue;
      grouped[a.type] ??= [];
      grouped[a.type].push(a);
    }
    return grouped;
  });

  const addAction = (id: string) => {
    const [type, actionName] = id.split(".");
    if (!type || !actionName) return;
    // @ts-expect-error
    const ActionClass = actions[type]?.[actionName];
    if (!ActionClass) return;
    const newAction = new ActionClass();
    props.onChange([...props.actions, newAction]);
    setKeyword("");
  };

  const handleDrop = (index: number) => {
    const { from } = drag();
    if (from !== null && from !== index) {
      const items = [...props.actions];
      const [movedItem] = items.splice(from, 1);
      items.splice(index, 0, movedItem);
      props.onChange(items);
    }
    setDrag({ from: null, over: null });
  };

  const removeAction = (id: string) => {
    const newActions = props.actions.filter(
      (a) => `${a.type}.${a.name}` !== id,
    );
    props.onChange(newActions);
    if (props.selectedId === id) props.onSelect(null);
  };

  return (
    <div class="relative w-full">
      <div class="flex max-h-64 flex-col rounded-sm border border-outline-light bg-white">
        <div class="flex flex-col gap-1 overflow-y-auto p-1">
          <For each={added()}>
            {(item, i) => (
              <SortableItem
                id={item.id}
                label={item.label}
                index={i()}
                isActive={props.selectedId === item.id}
                dragState={drag()}
                onActive={() => openDrawer(item.id)}
                onRemove={() => removeAction(item.id)}
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
            placeholder={i18n.t("actions.searchPlaceHolder")}
            value={keyword()}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onInput={(e) => setKeyword(e.currentTarget.value)}
          />
        </div>
      </div>

      <Show when={open() && Object.keys(results()).length > 0}>
        <ActionDropdown results={results()} onSelect={addAction} />
      </Show>
    </div>
  );
}
