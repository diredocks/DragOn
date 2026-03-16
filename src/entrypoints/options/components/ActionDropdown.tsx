import type { Component } from "solid-js";
import type { ActionSerialized } from "@/shared/models/action";

interface ActionDropdownProps {
  results: ActionSerialized[];
  onSelect: (item: ActionSerialized) => void;
}

function groupByType(
  results: ActionSerialized[],
): Record<string, ActionSerialized[]> {
  const grouped: Record<string, ActionSerialized[]> = {};
  for (const item of results) {
    grouped[item.type] ??= [];
    grouped[item.type].push(item);
  }
  return grouped;
}

export const ActionDropdown: Component<ActionDropdownProps> = (props) => {
  const grouped = () => groupByType(props.results);

  return (
    <div class="absolute top-full left-0 z-20 mt-1 w-full rounded-sm border border-outline-light bg-white shadow-sm">
      <div class="flex max-h-64 flex-col overflow-y-auto">
        <For each={Object.entries(grouped())}>
          {([_type, items]) => (
            <section class="border-outline-light border-b p-1 last:border-0">
              <For each={items}>
                {(item) => (
                  <div
                    class="cursor-pointer rounded-sm px-2.5 py-1 text-sm hover:bg-accent hover:text-content-inverse"
                    onmousedown={() => props.onSelect(item)}
                  >
                    {/* @ts-expect-error */}
                    {i18n.t(`actions.${item.type}.${item.name}.label`)}
                  </div>
                )}
              </For>
            </section>
          )}
        </For>
      </div>
    </div>
  );
};
