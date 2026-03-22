import { Action, type ActionRun } from "@/shared/models/action";
import { Position } from "@/shared/utils/type";

interface Options {
  focus: boolean;
  position: Position;
}

const fn: ActionRun<Options> = async (ctx, sender, options) => {
  if (!ctx.img || !sender.tab) return false;

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
    url: ctx.img,
    active: options.focus,
    openerTabId: sender.tab?.id,
    index,
  });

  return true;
};

export default class OpenInNewTab extends Action<Options> {
  type = "image" as const;
  name = "OpenInNewTab" as const;
  defaultSettings: Options = {
    focus: false,
    position: Position.Default,
  };
  enums = {
    position: Position,
  };
  fn = fn;
}
