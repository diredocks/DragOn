import { defaultSettings } from "./default";

export const traceSettingsStorage = storage.defineItem<typeof defaultSettings.trace>(
  "local:traceSettings",
  { defaultValue: defaultSettings.trace },
);

export const actionSettingsStorage = storage.defineItem<typeof defaultSettings.action>(
  "local:actionSettings",
  { defaultValue: defaultSettings.action },
);
