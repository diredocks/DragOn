export const nextTabIndex = async () => {
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true
  });
  return tab.index;
};
