import type { Component } from "solid-js";
import type { ActionItem } from "@/shared/models/action";

interface ActionDropdownProps {
  results: Record<string, ActionItem[]>;
  onSelect: (id: string) => void;
}

export const ActionDropdown: Component<ActionDropdownProps> = (props) => {
  return (
    <div class="absolute top-full left-0 z-20 mt-1 w-full rounded-sm border border-outline-light bg-white shadow-sm">
      <div class="flex max-h-64 flex-col overflow-y-auto">
        <For each={Object.entries(props.results)}>
          {([type, items]) => (
            <section class="border-outline-light border-b p-1 last:border-0">
              <For each={items}>
                {(item) => (
                  <div
                    class="cursor-pointer rounded-sm px-2.5 py-1 text-sm hover:bg-accent hover:text-content-inverse"
                    onmousedown={() => props.onSelect(item.id)}
                  >
                    {item.label}
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
