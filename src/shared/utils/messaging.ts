import { defineExtensionMessaging } from "@webext-core/messaging";
import type { Context } from "@/shared/models/context";
import type { Vector } from "./type";

export type ProtocolMap = {
  dragUpdate(data: { ctx: Context; pattern: Vector[] }): string | null;
  dragEnd(data: { ctx: Context; pattern: Vector[] }): boolean;
};
export const { sendMessage, onMessage } =
  defineExtensionMessaging<ProtocolMap>();

export type ProtocolMapTab = {
  clipboardWriteText(text: string): boolean;
  clipboardWriteImage(link: string): boolean;
};
export const { sendMessage: sendMessageTab, onMessage: onMessageTab } =
  defineExtensionMessaging<ProtocolMapTab>();
