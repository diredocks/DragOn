import { defineExtensionMessaging } from '@webext-core/messaging';
import { Context } from '../models/context';

export type ProtocolMap = Record<'Search' | 'Open' | 'Download', (ctx: Context) => boolean>;
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
