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

const rules = [
  new Rule(
    [[-1, 0]],
    [
      new actions.link.Open(),
      new actions.text.Search({ engine: 'baidu' }),
      new actions.image.Copy(),
    ]
  ),
  new Rule(
    [[1, 0]],
    [
      new actions.text.Search({ engine: 'bing' }),
      new actions.link.Open(),
      new actions.image.Copy(),
    ]
  )
];
