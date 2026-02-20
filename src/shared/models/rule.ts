import type { Action, ActionSerialized } from "@/shared/models/action";
import type { Context } from "@/shared/models/context";
import type { Vector } from "@/shared/utils/type";

export type RuleSerialized = {
  pattern: Vector[];
  actions: ActionSerialized[];
};

export class Rule {
  readonly pattern: Vector[];
  #actions: Action<any>[];

  constructor(pattern: Vector[], actions: Action<any>[]) {
    this.pattern = pattern;
    this.#actions = actions;
  }

  match(ctx: Context) {
    for (const each of this.#actions) {
      if (each.type === "text" && (ctx.dropText || ctx.selectedText)) {
        return each;
      }
      if (each.type === "link" && ctx.link) {
        return each;
      }
      if (each.type === "image" && ctx.img) {
        return each;
      }
    }
  }

  toJSON(): RuleSerialized {
    return {
      pattern: this.pattern,
      actions: this.#actions.map((e) => e.toJSON()),
    };
  }

  async execute(ctx: Context, sender: Browser.runtime.MessageSender) {
    for (const action of this.#actions) {
      if (await action.execute(ctx, sender)) return true;
    }
    return false;
  }
}
