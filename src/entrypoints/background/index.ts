import { Context } from '@/entrypoints/shared/models/context';
import { onMessage } from '@/entrypoints/shared/utils/messaging';

export default defineBackground(() => {
  onMessage('Text', m => handleText(m.data, m.sender));
  onMessage('Link', m => handleLink(m.data, m.sender));
  onMessage('Image', m => handleImage(m.data, m.sender));
});

const nextTabPosition = async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  return tab.index;
};

const handleText = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text) return false;
  browser.tabs.create({
    active: false,
    index: await nextTabPosition() + 1,
    openerTabId: sender.tab?.id,
    url: `https://google.com/search?q=${encodeURIComponent(text)}`,
  });
  return true;
}

const handleLink = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  if (!ctx.link) return false;
  browser.tabs.create({
    url: ctx.link,
    active: false,
    openerTabId: sender.tab?.id,
    index: await nextTabPosition() + 1,
  });
  return true;
}

const handleImage = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  if (!ctx.img) return false;
  console.log(ctx.img);
  return true;
}
