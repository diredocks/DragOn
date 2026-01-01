import { Context } from "@/entrypoints/shared/models/context"
import { sendMessageTab } from "@/entrypoints/shared/utils/messaging";

export const copy = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  if (!ctx.img) return false;
  return sendMessageTab("clipboardWriteImage", ctx.img, sender.tab?.id);
}

export const search = async () => { }
export const preview = async () => { }
