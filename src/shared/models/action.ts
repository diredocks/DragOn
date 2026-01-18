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

export type ActionRegistry = {
  [K in ActionType]: Record<
    string,
    new (
      settings?: Record<string, unknown>,
    ) => Action<any>
  >;
};

export abstract class Action<TOptions> {
  abstract type: ActionType;
  abstract fn: ActionRun<TOptions>;
  abstract defaultSettings: TOptions;
  permissions?: Browser.permissions.Permissions[];
  settings?: Partial<TOptions>;

  get name(): string {
    return this.constructor.name;
  }

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
    const ActionClass = actions[data.type][data.name];
    if (!ActionClass) {
      throw new Error(`Unknown action: ${data.type}.${data.name}`);
    }
    return new ActionClass(data.settings);
  }
}
