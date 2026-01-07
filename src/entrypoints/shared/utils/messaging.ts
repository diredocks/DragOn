import { defineExtensionMessaging } from '@webext-core/messaging';
import { Context } from '@/entrypoints/shared/models/context';
import { Vector } from './type';

export type ProtocolMap = {
  dragEnd(data: { ctx: Context, pattern: Vector[] }): boolean;
}
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();

export type ProtocolMapTab = {
  clipboardWriteText(text: string): boolean;
  clipboardWriteImage(link: string): boolean;
}
export const { sendMessage: sendMessageTab, onMessage: onMessageTab } = defineExtensionMessaging<ProtocolMapTab>();
