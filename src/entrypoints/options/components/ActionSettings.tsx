import type { Component } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import type { Action } from "@/shared/models/action";
import { SettingItem } from "./";

interface Props {
  action: Action<unknown> | null;
  onSave?: () => void;
}

export const ActionSettings: Component<Props> = (props) => {
  const [settings, setSettings] = createStore<Record<string, unknown>>({});

  createEffect(() => {
    const initial = {
      ...(props.action?.defaultSettings as Record<string, unknown>),
      ...(props.action?.settings as Record<string, unknown>),
    };
    setSettings(reconcile(initial));
  });

  const handleSave = () => {
    if (props.action) {
      props.action.settings = { ...settings };
      props.onSave?.();
    }
  };

  const getI18n = (key: string, suffix: "label" | "description") => {
    const action = props.action;
    if (!action) return "";
    return i18n.t(
      // @ts-expect-error dynamic i18n key
      `actions.${action.type}.${action.name}.settings.${key}.${suffix}`,
    );
  };

  return (
    <div class="settings flex h-full flex-col gap-3">
      <For each={Object.entries(props.action?.defaultSettings ?? {})}>
        {([key, defaultValue]) => {
          const value = () => settings[key] ?? defaultValue;
          const type = typeof defaultValue;

          return (
            <SettingItem
              name={getI18n(key, "label")}
              description={getI18n(key, "description")}
              nextLine={type === "string"}
            >
              <Switch>
                <Match when={type === "boolean"}>
                  <input
                    type="checkbox"
                    class="ml-2"
                    checked={value()}
                    onChange={(e) => setSettings(key, e.currentTarget.checked)}
                  />
                </Match>
                <Match when={type === "number"}>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={value()}
                    onInput={(e) =>
                      setSettings(key, e.currentTarget.valueAsNumber)
                    }
                  />
                </Match>
                <Match when={type === "string"}>
                  <input
                    class="mt-2 w-full"
                    value={value()}
                    onInput={(e) => setSettings(key, e.currentTarget.value)}
                  />
                </Match>
              </Switch>
            </SettingItem>
          );
        }}
      </For>

      <button
        type="button"
        onClick={handleSave}
        class="mt-auto cursor-pointer rounded-sm bg-accent px-0.5 py-1.25 text-content-inverse outline-accent"
      >
        {i18n.t("rules.save")}
      </button>
    </div>
  );
};
