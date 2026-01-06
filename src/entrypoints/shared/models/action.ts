import { Context } from "@/entrypoints/shared/models/context";

export type ActionType = 'text' | 'link' | 'image';

export type ActionRun<TOptions> = (
  ctx: Context,
  sender: Browser.runtime.MessageSender,
  options: TOptions
) => Promise<boolean> | boolean;

export abstract class Action<TOptions> {
  abstract type: ActionType;
  abstract fn: ActionRun<TOptions>;
  abstract defaultSettings: TOptions;
  permissions?: Browser.permissions.Permissions[];
  settings?: Partial<TOptions>;

  constructor(settings?: Partial<TOptions>) {
    this.settings = settings;
  }

  execute(ctx: Context, sender: Browser.runtime.MessageSender) {
    const options = { ...this.defaultSettings, ...this.settings } as TOptions;
    return this.fn(ctx, sender, options);
  }
}
