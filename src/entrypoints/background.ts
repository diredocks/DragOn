import { Context } from './models/context';
import { onMessage } from './utils/messaging';

export default defineBackground(() => {
  onMessage('Search', m => handleSearch(m.data));
  onMessage('Open', m => handleOpen(m.data));
  onMessage('Download', handleDownload);
});

const nextTabPosition = async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  return tab.index;
};

const handleSearch = async (ctx: Context) => {
  const text = ctx.selectedText || ctx.dropText;
  if (!text) return false;
  browser.tabs.create({
    active: false,
    index: await nextTabPosition() + 1,
    url: `https://google.com/search?q=${encodeURIComponent(text)}`,
  });
  return true;
}

const handleOpen = async (ctx: Context) => {
  if (!ctx.link) return false;
  browser.tabs.create({ url: ctx.link, active: false, index: await nextTabPosition() + 1 });
  return true;
}

const handleDownload = async () => {
  return true;
}
