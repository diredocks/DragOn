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

  async execute(ctx: Context, sender: Browser.runtime.MessageSender) {
    for (const action of this.#actions) {
      if (await action.execute(ctx, sender)) return true;
    }
    return false;
  }
}
