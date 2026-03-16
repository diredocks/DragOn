import { defaultRules, defaultSettings } from "./default";

export const traceSettingsStorage = storage.defineItem<
  typeof defaultSettings.trace
>("local:settings.trace", { fallback: defaultSettings.trace });

export const actionSettingsStorage = storage.defineItem<
  typeof defaultSettings.action
>("local:settings.action", { fallback: defaultSettings.action });

export const rulesStorage = storage.defineItem<typeof defaultRules>(
  "local:rules",
  { fallback: defaultRules },
);
