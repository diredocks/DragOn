import { Rule } from "@/shared/models/rule";
import { rulesStorage } from "@/shared/settings/storage";
import { getRuleByPattern } from "@/shared/utils/matcher";
import { onMessage } from "@/shared/utils/messaging";

export default defineBackground(async () => {
  const serializedRules = await rulesStorage.getValue();
  let rules: Rule[] = await Promise.all(
    serializedRules.map((r) => Rule.fromJSON(r)),
  );

  rulesStorage.watch(async (newRules) => {
    rules = await Promise.all(newRules.map((r) => Rule.fromJSON(r)));
  });

  onMessage("dragEnd", (m) => {
    const rule = getRuleByPattern(m.data.pattern, rules);
    return rule?.execute(m.data.ctx, m.sender) ?? false;
  });

  onMessage("dragUpdate", (m) => {
    const rule = getRuleByPattern(m.data.pattern, rules);
    return rule?.match(m.data.ctx)?.toString() ?? null;
  });

  browser.action.onClicked.addListener(() => {
    browser.runtime.openOptionsPage();
  });
});
