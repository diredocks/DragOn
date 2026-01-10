import { Action, ActionRun } from "@/shared/models/action";
import { sendMessageTab } from "@/shared/utils/messaging";

interface Options { }

const fn: ActionRun<Options> = async (ctx, sender) => {
  if (!ctx.link) return false;

  sendMessageTab("clipboardWriteText", ctx.link, sender.tab?.id);
  return true;
};

export class Copy extends Action<Options> {
  name = 'copy' as const;
  type = 'link' as const;
  defaultSettings: Options = {};
  fn = fn;
}

