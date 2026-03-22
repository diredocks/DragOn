import { Action, type ActionRun } from "@/shared/models/action";

const fn: ActionRun<unknown> = async (ctx) => {
  if (!ctx.link) return false;

  await browser.bookmarks.create({
    title: ctx.linkText || ctx.link,
    url: ctx.link,
  });

  return true;
};

export default class BookmarkLink extends Action<unknown> {
  type = "link" as const;
  name = "BookmarkLink" as const;
  defaultSettings = {};
  permissions = ["bookmarks"] as const;
  fn = fn;
}
