import type { JSX } from "solid-js";

type SettingItemProps = {
  name: string;
  description?: string;
  children?: JSX.Element;
};

export function SettingItem(props: SettingItemProps) {
  const hasDescription = () =>
    !!props.description && props.description !== "NO_CONTENT";

  return (
    <div class="group my-2 flex items-stretch gap-x-10">
      <div
        class={`mr-3 flex flex-1 flex-col ${
          hasDescription() ? "justify-start" : "justify-center"
        }`}
      >
        <p class="m-0">{props.name}</p>

        <Show when={hasDescription()}>
          <p class="text-sm opacity-50 transition-opacity duration-300 group-hover:opacity-100">
            {props.description}
          </p>
        </Show>
      </div>

      <div class="input flex items-center">{props.children}</div>
    </div>
  );
}
