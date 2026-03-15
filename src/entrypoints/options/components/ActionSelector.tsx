import { actions } from "@/entrypoints/background/actions";
import type { ActionSerialized, ActionType } from "@/shared/models/action";
import { ActionDropdown } from "./ActionDropdown";
import { SortableItem } from "./SortableItem";

type ActionItem = {
  id: string;
  type: ActionType;
  label: string;
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

type ActionSelectorProps = {
  actions: ActionSerialized[];
  onChange: (actions: ActionSerialized[]) => void;
};

export function ActionSelector(props: ActionSelectorProps) {
  const [open, setOpen] = createSignal(false);
  const [keyword, setKeyword] = createSignal("");
  const [activeId, setActiveId] = createSignal<string | null>(null);
  const [drag, setDrag] = createSignal<{
    from: number | null;
    over: number | null;
  }>({
    from: null,
    over: null,
  });

  // Convert ActionSerialized[] to ActionItem[] for internal display
  const added = createMemo(
    () =>
      props.actions
        .map((a) =>
          ALL_ACTIONS.find((item) => item.id === `${a.type}.${a.name}`),
        )
        .filter(Boolean) as ActionItem[],
  );

  const results = createMemo(() => {
    return ALL_ACTIONS.filter(
      (a) =>
        (a.label.toLowerCase().includes(keyword().toLowerCase()) ||
          a.id.toLowerCase().includes(keyword().toLowerCase())) &&
        !added().some(
          (addedItem) => addedItem.id === a.id && addedItem.type === a.type,
        ),
    ).reduce(
      (acc, item) => {
        acc[item.type] ??= [];
        acc[item.type].push(item);
        return acc;
      },
      {} as Record<string, ActionItem[]>,
    );
  });

  const addAction = (id: string) => {
    const action = ALL_ACTIONS.find((a) => a.id === id);
    if (!action) return;
    const [type, actionName] = id.split(".");
    if (!type || !actionName) return;
    const newAction: ActionSerialized = {
      type: type as ActionType,
      name: actionName,
    };
    props.onChange([...props.actions, newAction]);
    setActiveId(id);
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
    if (activeId() === id) setActiveId(null);
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
                isActive={activeId() === item.id}
                dragState={drag()}
                onActive={() =>
                  setActiveId(activeId() === item.id ? null : item.id)
                }
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
