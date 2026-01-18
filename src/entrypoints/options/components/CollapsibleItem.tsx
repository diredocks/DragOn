import type { JSX } from "solid-js";
import { SettingItem } from "./SettingItem";

type CollapsibleItemProps = {
  name: string;
  description: string;
  children?: JSX.Element;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export function CollapsibleItem(props: CollapsibleItemProps) {
  const isOpen = () => props.checked ?? false;

  const handleToggle = (checked: boolean) => {
    if (props.onChange) {
      props.onChange(checked);
    }
  };

  return (
    <>
      <SettingItem name={props.name} description={props.description}>
        <input
          type="checkbox"
          checked={isOpen()}
          onChange={(e) => handleToggle(e.currentTarget.checked)}
        />
      </SettingItem>

      <div class={`collapsible-content ${isOpen() ? "open" : ""}`}>
        <div class="collapsible-content-inner">{props.children}</div>
      </div>
    </>
  );
}
