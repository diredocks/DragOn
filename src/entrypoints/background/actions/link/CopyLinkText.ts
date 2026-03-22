import { Action, type ActionRun } from "@/shared/models/action";
import { sendMessageTab } from "@/shared/utils/messaging";

const fn: ActionRun<unknown> = async (ctx, sender) => {
  if (!ctx.linkText) return false;

  sendMessageTab("clipboardWriteText", ctx.linkText, sender.tab?.id);
  return true;
};

export default class CopyLinkText extends Action<unknown> {
  type = "link" as const;
  name = "CopyLinkText" as const;
  defaultSettings = {};
  fn = fn;
}
