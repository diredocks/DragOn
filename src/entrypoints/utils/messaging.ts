import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
  Search(text: string): void;
  Open(link: string): void;
  Download(image: string): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
