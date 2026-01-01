import { Context } from '@/entrypoints/shared/models/context';
import { onMessage } from '@/entrypoints/shared/utils/messaging';
import * as textActions from './actions/text';
import * as linkActions from './actions/link';
import * as imageActions from './actions/image';

export default defineBackground(() => {
  onMessage('Text', m => handleText(m.data, m.sender));
  onMessage('Link', m => handleLink(m.data, m.sender));
  onMessage('Image', m => handleImage(m.data, m.sender));
});

const handleText = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  // TODO: can we just check if text exists here?
  return textActions.search(ctx, sender);
}

const handleLink = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  return linkActions.open(ctx, sender);
}

const handleImage = async (ctx: Context, sender: Browser.runtime.MessageSender) => {
  return imageActions.copy(ctx, sender);
}
