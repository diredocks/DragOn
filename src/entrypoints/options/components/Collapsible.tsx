import MdiChevronDown from "@iconify-solid/mdi/chevron-down";
import { createSignal, type JSX } from "solid-js";

type CollapsibleProps = {
  name: string;
  children?: JSX.Element;
  defaultOpen?: boolean;
};

export function Collapsible(props: CollapsibleProps) {
  const [open, setOpen] = createSignal(props.defaultOpen ?? false);

  return (
    <>
      <div class="item">
        <button
          type="button"
          class="flex w-full cursor-pointer select-none items-center text-accent transition-colors duration-400"
          onClick={() => setOpen(!open())}
        >
          <span>{props.name}</span>
          <MdiChevronDown
            class={`ml-1 h-4 w-4 transition-transform duration-400 ${open() ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <div class={`collapsible-content ${open() ? "open" : ""}`}>
        <div class="collapsible-content-inner">{props.children}</div>
      </div>
    </>
  );
}
