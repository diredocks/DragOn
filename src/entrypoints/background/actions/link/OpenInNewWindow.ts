import { Action, type ActionRun } from "@/shared/models/action";

interface Options {
  focus: boolean;
}

const fn: ActionRun<Options> = async (ctx, sender, options) => {
  if (!ctx.link) return false;

  await browser.windows.create({
    url: ctx.link,
    focused: options.focus,
  });

  return true;
};

export default class OpenInNewWindow extends Action<Options> {
  type = "link" as const;
  name = "OpenInNewWindow" as const;
  defaultSettings: Options = {
    focus: true,
  };
  fn = fn;
}
