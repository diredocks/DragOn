import { Action, ActionRun } from "@/entrypoints/shared/models/action";
import { nextTabIndex } from "@/entrypoints/shared/utils/common";

interface Options {
  engine: 'bing' | 'baidu' | 'google' | 'duckduckgo';
  openInBackground: boolean;
}

const fn: ActionRun<Options> = async (ctx, sender, options) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text) return false;

  const engineMap: Record<Options['engine'], string> = {
    google: 'https://google.com/search?q=',
    bing: 'https://bing.com/search?q=',
    baidu: 'https://www.baidu.com/s?wd=',
    duckduckgo: 'https://duckduckgo.com/?q=',
  };

  const url = `${engineMap[options.engine]}${encodeURIComponent(text)}`;

  await browser.tabs.create({
    active: !options.openInBackground,
    index: (await nextTabIndex()) + 1,
    openerTabId: sender.tab?.id,
    url,
  });

  return true;
};

export class Search extends Action<Options> {
  type = 'text' as const;
  defaultSettings: Options = {
    engine: 'google',
    openInBackground: true,
  };
  fn = fn;
}
