import { Rule, type RuleSerialized } from "@/shared/models/rule";
import { rulesStorage } from "@/shared/settings/storage";
import { getRuleByPattern } from "@/shared/utils/matcher";
import { onMessage } from "@/shared/utils/messaging";

export default defineBackground(() => {
  let rules: Rule[] = [];

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

  const loadRules = async (rawRules: RuleSerialized[]) => {
    rules = await Promise.all(rawRules.map((r) => Rule.fromJSON(r)));
  };

  rulesStorage.getValue().then(loadRules);
  rulesStorage.watch(loadRules);
});
