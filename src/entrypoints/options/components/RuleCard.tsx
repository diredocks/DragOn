import MdiCloseThick from "@iconify-solid/mdi/close-thick";
import type { Vector } from "@/shared/utils/type";
import { PatternThumbnail } from "./index";

type RulePanelProps = {
  pattern: Vector[];
  onSelect: () => void;
  onDelete?: (e: Event) => void;
};

export function RuleCard(props: RulePanelProps) {
  return (
    <li
      onclick={props.onSelect}
      class="group relative flex aspect-4/5 cursor-pointer flex-col rounded-sm border border-outline bg-white transition-all duration-300 hover:shadow-sm"
    >
      <PatternThumbnail
        pattern={props.pattern}
        showAnimation={true}
        viewBox={100}
      />
      {props.onDelete && (
        <button
          type="button"
          onClick={props.onDelete}
          class="absolute top-0 right-0 flex h-7.5 w-7.5 translate-x-1/2 -translate-y-1/2 scale-70 cursor-pointer items-center justify-center rounded-full bg-danger text-white opacity-0 transition-all duration-300 hover:scale-110 group-hover:scale-100 group-hover:opacity-100"
          title={i18n.t("rules.delete")}
        >
          <MdiCloseThick width="16" height="16" />
        </button>
      )}
    </li>
  );
}
