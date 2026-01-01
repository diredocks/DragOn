import { defineExtensionMessaging } from '@webext-core/messaging';
import { Context } from '@/entrypoints/shared/models/context';

export type ProtocolMap = Record<'Text' | 'Link' | 'Image', (ctx: Context) => boolean>;
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

export type ProtocolMapTab = {
  clipboardWriteText(text: string): boolean;
  clipboardWriteImage(link: string): boolean;
}
export const { sendMessage: sendMessageTab, onMessage: onMessageTab } = defineExtensionMessaging<ProtocolMapTab>();
