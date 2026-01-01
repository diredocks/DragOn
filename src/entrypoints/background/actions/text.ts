import { Context } from "@/entrypoints/shared/models/context";
import { sendMessageTab } from "@/entrypoints/shared/utils/messaging";
import { nextTabIndex } from "@/entrypoints/shared/utils/next-tab-index";

export const search = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text) return false;
  browser.tabs.create({
    active: false,
    index: await nextTabIndex() + 1,
    openerTabId: sender.tab?.id,
    url: `https://google.com/search?q=${encodeURIComponent(text)}`,
  });
  return true;
}

export const copy = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text) return false;
  sendMessageTab("clipboardWriteText", text, sender.tab?.id);
  return true;
}

export const openAsLink = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text || !URL.canParse(text)) return false;
  browser.tabs.create({
    active: false,
    index: await nextTabIndex() + 1,
    openerTabId: sender.tab?.id,
    url: text,
  });
  return true;
}
