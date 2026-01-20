import { Action, type ActionRun } from "@/shared/models/action";
import { sendMessageTab } from "@/shared/utils/messaging";

type Options = {};

const fn: ActionRun<Options> = async (ctx, sender) => {
  if (!ctx.link) return false;

  sendMessageTab("clipboardWriteText", ctx.link, sender.tab?.id);
  return true;
};

export class Copy extends Action<Options> {
  type = "link" as const;
  name = "Copy" as const;
  defaultSettings: Options = {};
  fn = fn;
}
