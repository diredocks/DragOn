import type { ActionRegistry } from "@/shared/models/action";
import * as image from "./image";
import * as link from "./link";
import * as text from "./text";

export const actions: ActionRegistry = {
  text,
  link,
  image,
};
