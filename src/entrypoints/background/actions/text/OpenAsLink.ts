import { Action, type ActionRun } from "@/shared/models/action";
import { Position } from "@/shared/utils/type";

interface Options {
  focus: boolean;
  position: Position;
}

const fn: ActionRun<Options> = async (ctx, sender, options) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text || !URL.canParse(text) || !sender.tab) return false;

  const index = (() => {
    switch (options.position) {
      case Position.Before:
        return sender.tab.index;
      case Position.After:
        return sender.tab.index + 1;
      case Position.End:
        return 999;
      case Position.Start:
        return 0;
      default:
        return undefined;
    }
  })();

  await browser.tabs.create({
    active: options.focus,
    openerTabId: sender.tab?.id,
    url: text,
    index,
  });

  return true;
};

export default class OpenAsLink extends Action<Options> {
  type = "text" as const;
  name = "OpenAsLink" as const;
  defaultSettings: Options = {
    focus: false,
    position: Position.Default,
  };
  enums = {
    position: Position,
  };
  fn = fn;
}
