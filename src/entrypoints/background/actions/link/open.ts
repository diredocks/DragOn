import { Action, ActionRun } from "@/entrypoints/shared/models/action";
import { nextTabIndex } from "@/entrypoints/shared/utils/common";

interface Options {
  openInBackground: boolean;
}

const fn: ActionRun<Options> = async (ctx, sender, options) => {
  if (!ctx.link) return false;

  await browser.tabs.create({
    url: ctx.link,
    active: !options.openInBackground,
    openerTabId: sender.tab?.id,
    index: (await nextTabIndex()) + 1,
  });

  return true;
};

export class Open extends Action<Options> {
  name = 'open' as const;
  type = 'link' as const;
  defaultSettings: Options = {
    openInBackground: true,
  };
  fn = fn;
}
