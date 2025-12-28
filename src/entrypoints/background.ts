import { onMessage } from './utils/messaging';

export default defineBackground(() => {
  onMessage('Search', m => handleSearch(m.data));
  onMessage('Open', m => { handleOpen(m.data) });
  onMessage('Download', handleDownload);
});

const nextTabPosition = async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  return tab.index;
};

const handleSearch = async (text: string) => {
  browser.tabs.create({ url: `https://google.com/search?q=${text}`, active: false, index: await nextTabPosition() + 1 });
}
const handleOpen = async (link: string) => {
  browser.tabs.create({ url: link, active: false, index: await nextTabPosition() + 1 });
}
const handleDownload = async () => { }
