import { Context } from '@/entrypoints/shared/models/context';
import { onMessage } from '@/entrypoints/shared/utils/messaging';
import { actions } from './actions';

export default defineBackground(() => {
  onMessage('Text', m => handleText(m.data, m.sender));
  onMessage('Link', m => handleLink(m.data, m.sender));
  onMessage('Image', m => handleImage(m.data, m.sender));
});

const handleText = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  // TODO: can we just check if text exists here?
  const search = new actions.text.Search();
  return search.execute(ctx, sender);
}

const handleLink = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  const open = new actions.link.Open();
  return open.execute(ctx, sender);
}

const handleImage = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  const copy = new actions.image.Copy();
  return copy.execute(ctx, sender);
}
