import { PatternThumbnail } from "./index";
import type { Vector } from "@/shared/utils/type";

type RulePanelProps = {
  pattern: Vector[];
  onSelect: () => void;
};

export function RuleCard(props: RulePanelProps) {
  return (
    <li
      onclick={props.onSelect}
      class="flex aspect-4/5 cursor-pointer flex-col rounded-sm border border-outline bg-white transition-all duration-300 hover:shadow-sm"
    >
      <PatternThumbnail
        pattern={props.pattern}
        showAnimation={true}
        viewBox={100}
      />
    </li>
  );
}
