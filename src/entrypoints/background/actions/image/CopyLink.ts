import { Action, type ActionRun } from "@/shared/models/action";
import { sendMessageTab } from "@/shared/utils/messaging";

const fn: ActionRun<unknown> = async (ctx, sender) => {
  if (!ctx.img) return false;

  sendMessageTab("clipboardWriteText", ctx.img, sender.tab?.id);
  return true;
};

export default class CopyLink extends Action<unknown> {
  type = "image" as const;
  name = "CopyLink" as const;
  defaultSettings = {};
  fn = fn;
}
