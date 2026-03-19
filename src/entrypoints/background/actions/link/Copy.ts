import { Action, type ActionRun } from "@/shared/models/action";
import { sendMessageTab } from "@/shared/utils/messaging";

const fn: ActionRun<unknown> = async (ctx, sender) => {
  if (!ctx.link) return false;

  sendMessageTab("clipboardWriteText", ctx.link, sender.tab?.id);
  return true;
};

export default class Copy extends Action<unknown> {
  type = "link" as const;
  name = "Copy" as const;
  defaultSettings = {};
  fn = fn;
}
