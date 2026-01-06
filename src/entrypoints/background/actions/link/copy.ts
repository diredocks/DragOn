import { Action, ActionRun } from "@/entrypoints/shared/models/action";
import { sendMessageTab } from "@/entrypoints/shared/utils/messaging";

interface Options { }

const fn: ActionRun<Options> = async (ctx, sender) => {
  if (!ctx.link) return false;

  sendMessageTab("clipboardWriteText", ctx.link, sender.tab?.id);
  return true;
};

export class Copy extends Action<Options> {
  type = 'link' as const;
  defaultSettings: Options = {};
  fn = fn;
}

