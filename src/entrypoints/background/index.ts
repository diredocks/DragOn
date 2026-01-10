import { Rule } from '@/shared/models/rule';
import { onMessage } from '@/shared/utils/messaging';
import { getRuleByPattern } from '@/shared/utils/matcher';
import { actions } from './actions';

export default defineBackground(() => {
  onMessage('dragEnd', m => {
    return getRuleByPattern(m.data.pattern, rules())?.execute(m.data.ctx, m.sender) ?? false;
  });
  onMessage('dragUpdate', m => {
    return getRuleByPattern(m.data.pattern, rules())?.match(m.data.ctx)?.toString() ?? null;
  });
});

const rules = () => {
  const rules: Rule[] = [];
  for (const i of [-1, 0, 1]) {
    for (const j of [-1, 0, 1]) {
      if (i === 0 && j === 0) continue;
      rules.push(new Rule(
        [[i, j]],
        [
          new actions.text.Search({ engine: 'bing' }),
          new actions.link.Open(),
          new actions.image.Copy(),
        ]
      ))
    }
  }
  return rules;
};
