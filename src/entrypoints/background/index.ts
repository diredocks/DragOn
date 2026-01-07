import { Rule } from '@/entrypoints/shared/models/rule';
import { onMessage } from '@/entrypoints/shared/utils/messaging';
import { actions } from './actions';
import { getRuleByPattern } from '@/entrypoints/shared/utils/matcher';

export default defineBackground(() => {
  onMessage('dragEnd', m => {
    return getRuleByPattern(m.data.pattern, rules)?.execute(m.data.ctx, m.sender) ?? false;
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
