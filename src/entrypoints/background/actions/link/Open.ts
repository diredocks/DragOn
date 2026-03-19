import { Action, type ActionRun } from "@/shared/models/action";

const fn: ActionRun<unknown> = async (ctx, sender) => {
  if (!ctx.link) return false;

  await browser.tabs.update(sender.tab?.id, { url: ctx.link });
  return true;
};

export default class Open extends Action<unknown> {
  type = "link" as const;
  name = "Open" as const;
  defaultSettings = {};
  fn = fn;
}
