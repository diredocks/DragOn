import { Context } from '@/entrypoints/shared/models/context';
import { Rule } from '@/entrypoints/shared/models/rule';
import { onMessage } from '@/entrypoints/shared/utils/messaging';
import { actions } from './actions';

export default defineBackground(() => {
  onMessage('DragEnd', m => handleDragEnd(m.data, m.sender));
});

const dragRule = new Rule(
  [],
  [
    new actions.link.Open(),
    new actions.text.Search(),
    new actions.image.Copy(),
  ]
)

const handleDragEnd = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  return dragRule.execute(ctx, sender);
}
