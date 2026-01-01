import { defineExtensionMessaging } from '@webext-core/messaging';
import { Context } from '@/entrypoints/shared/models/context';

export type ProtocolMap = Record<'Text' | 'Link' | 'Image', (ctx: Context) => boolean>;
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
