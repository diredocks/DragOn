import { Action, type ActionRun } from "@/shared/models/action";
import { sendMessageTab } from "@/shared/utils/messaging";

type Options = {};

const fn: ActionRun<Options> = async (ctx, sender) => {
  if (!ctx.img) return false;
  return sendMessageTab("clipboardWriteImage", ctx.img, sender.tab?.id);
};

export class Copy extends Action<Options> {
  type = "image" as const;
  name = "Copy" as const;
  defaultSettings: Options = {};
  fn = fn;
}
