import { Action, type ActionRun } from "@/shared/models/action";
import { Position } from "@/shared/utils/type";

interface Options {
  focus: boolean;
  position: Position;
  customEngine: string;
}

const fn: ActionRun<Options> = async (ctx, sender, options) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text || !sender.tab) return false;

  const url = `${options.customEngine}${encodeURIComponent(text)}`;

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
    active: !options.focus,
    openerTabId: sender.tab?.id,
    index,
    url,
  });

  return true;
};

export default class Search extends Action<Options> {
  type = "text" as const;
  name = "Search" as const;
  defaultSettings: Options = {
    focus: false,
    position: Position.Default,
    customEngine: "https://bing.com/search?q=",
  };
  enums = {
    position: Position,
  };
  fn = fn;
}
