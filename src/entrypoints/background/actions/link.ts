import { Context } from "@/entrypoints/shared/models/context"
import { sendMessageTab } from "@/entrypoints/shared/utils/messaging";
import { nextTabIndex } from "@/entrypoints/shared/utils/next-tab-index";

export const open = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  if (!ctx.link) return false;
  browser.tabs.create({
    url: ctx.link,
    active: false,
    openerTabId: sender.tab?.id,
    index: await nextTabIndex() + 1,
  });
  return true;
}

export const copy = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  if (!ctx.link) return false;
  sendMessageTab("clipboardWriteText", ctx.link, sender.tab?.id);
  return true;
}

export const copyText = async () => { }
export const qrcode = async () => { }

