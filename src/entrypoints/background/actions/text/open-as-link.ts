import { Action, type ActionRun } from "@/shared/models/action";
import { nextTabIndex } from "@/shared/utils/common";

interface Options {
  openInBackground: boolean;
}

const fn: ActionRun<Options> = async (ctx, sender, options) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text || !URL.canParse(text)) return false;

  await browser.tabs.create({
    active: !options.openInBackground,
    index: (await nextTabIndex()) + 1,
    openerTabId: sender.tab?.id,
    url: text,
  });

  return true;
};

export class OpenAsLink extends Action<Options> {
  type = "text" as const;
  defaultSettings: Options = {
    openInBackground: true,
  };
  fn = fn;
}
