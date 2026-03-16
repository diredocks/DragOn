import { actions } from "@/entrypoints/background/actions";
import type { Context } from "@/shared/models/context";

export type ActionType = "text" | "link" | "image";

export type ActionRun<TOptions> = (
  ctx: Context,
  sender: Browser.runtime.MessageSender,
  options: TOptions,
) => Promise<boolean> | boolean;

export type ActionSerialized = {
  type: ActionType;
  name: string;
  settings?: Record<string, unknown>;
};

export abstract class Action<TOptions> {
  abstract type: ActionType;
  abstract name: string;
  abstract fn: ActionRun<TOptions>;
  abstract defaultSettings: TOptions;
  permissions?: Browser.permissions.Permissions[];
  settings?: Partial<TOptions>;

  constructor(settings?: Partial<TOptions>) {
    this.settings = settings;
  }

  toString(): string {
    // @ts-expect-error
    return i18n.t(`actions.${this.type}.${this.name}.label`);
  }

  execute(ctx: Context, sender: Browser.runtime.MessageSender) {
    const options = { ...this.defaultSettings, ...this.settings } as TOptions;
    return this.fn(ctx, sender, options);
  }

  toJSON(): ActionSerialized {
    return {
      type: this.type,
      name: this.name,
      settings: this.settings as Record<string, unknown>,
    };
  }

  static fromJSON(data: ActionSerialized): Action<unknown> {
    // @ts-expect-error
    const ActionClass = actions[data.type][data.name];
    if (!ActionClass) {
      throw new Error(`Unknown action: ${data.type}.${data.name}`);
    }
    return new ActionClass(data.settings);
  }
}

export interface ActionItem {
  type: string;
  id: string;
  label: string;
}
