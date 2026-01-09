import { Action } from "@/entrypoints/shared/models/action";
import { Vector } from "@/entrypoints/shared/utils/type";
import { Context } from "@/entrypoints/shared/models/context";

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

  async execute(ctx: Context, sender: Browser.runtime.MessageSender) {
    for (const action of this.#actions) {
      if (await action.execute(ctx, sender)) return true;
    }
    return false;
  }
}
