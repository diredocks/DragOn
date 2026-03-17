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
  permissions?: readonly Browser.runtime.ManifestPermission[];
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

  static async fromJSON(data: ActionSerialized) {
    const modules = import.meta.glob<{
      default: new (settings?: unknown) => Action<unknown>;
    }>("@/entrypoints/background/actions/**/*.ts");
    const path = `/src/entrypoints/background/actions/${data.type}/${data.name}.ts`;

    const loader = modules[path];
    if (!loader) {
      throw new Error(`Unknown action: ${data.type}.${data.name}`);
    }

    return new (await loader()).default(data.settings);
  }
}
