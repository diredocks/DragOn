import { Action, type ActionRun } from "@/shared/models/action";
import { nextTabIndex } from "@/shared/utils/common";

interface Options {
  customEngine: string;
  openInBackground: boolean;
}

const fn: ActionRun<Options> = async (ctx, sender, options) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text) return false;

  const url = `${options.customEngine}${encodeURIComponent(text)}`;

  await browser.tabs.create({
    active: !options.openInBackground,
    index: (await nextTabIndex()) + 1,
    openerTabId: sender.tab?.id,
    url,
  });

  return true;
};

export class Search extends Action<Options> {
  type = "text" as const;
  name = "Search" as const;
  defaultSettings: Options = {
    customEngine: "https://bing.com/search?q=",
    openInBackground: true,
  };
  fn = fn;
}
