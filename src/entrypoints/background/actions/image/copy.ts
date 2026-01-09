import { Action, ActionRun } from "@/entrypoints/shared/models/action";
import { sendMessageTab } from "@/entrypoints/shared/utils/messaging";

interface Options { }

const fn: ActionRun<Options> = async (ctx, sender) => {
  if (!ctx.img) return false;
  return sendMessageTab("clipboardWriteImage", ctx.img, sender.tab?.id);
};

export class Copy extends Action<Options> {
  name = 'copy' as const;
  type = 'image' as const;
  defaultSettings: Options = {};
  fn = fn;
}
