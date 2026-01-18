import {
  actionSettingsStorage,
  traceSettingsStorage,
} from "@/shared/settings/storage";
import { CollapsibleItem, ColorPicker, SettingItem } from "../components";
import "../styles/base.css";

function TraceSettings() {
  const [settings, setSettings] = createStore(traceSettingsStorage.fallback);

  traceSettingsStorage.getValue().then((v) => setSettings(v));

  const handleInput = (field: keyof typeof settings, value: any) => {
    setSettings({ [field]: value });
    traceSettingsStorage.setValue(settings);
  };

  return (
    <CollapsibleItem
      name={i18n.t("settings.trace.enable.label")}
      description={i18n.t("settings.trace.enable.description")}
      checked={settings.enable}
      onChange={(e) => handleInput("enable", e)}
    >
      <Index each={Object.keys(settings).slice(1) as (keyof typeof settings)[]}>
        {(field) => {
          const f = field();
          const t = typeof settings[f];
          return (
            <SettingItem
              name={i18n.t(`settings.trace.${f}.label`)}
              description={i18n.t(`settings.trace.${f}.description`)}
            >
              <Switch>
                <Match when={t === "boolean"}>
                  <input
                    type="checkbox"
                    checked={settings[f] as boolean}
                    onInput={(e) => handleInput(f, e.target.checked)}
                  />
                </Match>

                <Match when={t === "number"}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings[f] as number}
                    onInput={(e) => handleInput(f, Number(e.target.value))}
                  />
                </Match>

                <Match when={t === "string"}>
                  <ColorPicker
                    value={settings[f] as string}
                    onChange={(hex) => handleInput(f, hex)}
                  />
                </Match>
              </Switch>
            </SettingItem>
          );
        }}
      </Index>
    </CollapsibleItem>
  );
}

function ActionSettings() {
  const [settings, setSettings] = createStore(actionSettingsStorage.fallback);

  actionSettingsStorage.getValue().then((v) => setSettings(v));

  const handleInput = (field: keyof typeof settings, value: any) => {
    setSettings({ [field]: value });
    actionSettingsStorage.setValue(settings);
  };

  return (
    <CollapsibleItem
      name={i18n.t("settings.action.enable.label")}
      description={i18n.t("settings.action.enable.description")}
      checked={settings.enable}
      onChange={(e) => handleInput("enable", e)}
    >
      <Index each={Object.keys(settings).slice(1) as (keyof typeof settings)[]}>
        {(field) => {
          const f = field();
          const t = typeof settings[f];
          return (
            <SettingItem
              name={i18n.t(`settings.action.${f}.label`)}
              description={i18n.t(`settings.action.${f}.description`)}
            >
              <Switch>
                <Match when={t === "boolean"}>
                  <input
                    type="checkbox"
                    checked={settings[f] as boolean}
                    onInput={(e) => handleInput(f, e.target.checked)}
                  />
                </Match>

                <Match when={t === "number"}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings[f] as number}
                    onInput={(e) => handleInput(f, Number(e.target.value))}
                  />
                </Match>

                <Match when={t === "string" && !f.includes("Color")}>
                  <input
                    type="input"
                    value={settings[f] as string}
                    onInput={(e) => handleInput(f, e.target.value)}
                  />
                </Match>

                <Match when={t === "string" && f.includes("Color")}>
                  <ColorPicker
                    value={settings[f] as string}
                    onChange={(hex) => handleInput(f, hex)}
                  />
                </Match>
              </Switch>
            </SettingItem>
          );
        }}
      </Index>
    </CollapsibleItem>
  );
}

export function Settings() {
  return (
    <div>
      <section>
        <TraceSettings />
      </section>
      <section>
        <ActionSettings />
      </section>
    </div>
  );
}
