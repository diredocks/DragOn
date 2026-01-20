import { Action, type ActionRun } from "@/shared/models/action";
import { sendMessageTab } from "@/shared/utils/messaging";

type Options = {};

const fn: ActionRun<Options> = async (ctx, sender) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text) return false;

  sendMessageTab("clipboardWriteText", text, sender.tab?.id);
  return true;
};

export class Copy extends Action<Options> {
  type = "text" as const;
  name = "Copy" as const;
  defaultSettings: Options = {};
  fn = fn;
}
