import type { RuleSerialized } from "../models/rule";
import type { Settings } from "./schema";

export const defaultSettings: Settings = {
  trace: {
    enable: true,
    strokeColor: "#7ccf00cc",
    lineGrowth: true,
    lineWidth: 10,
  },
  action: {
    enable: true,
    followCursor: false,
    fontColor: "#ffffffff",
    backgroundColor: "#00000080",
    fontSize: "7vh",
    horizontalPosition: 50,
    verticalPosition: 40,
  },
};

const rules: RuleSerialized[] = [];
for (const i of [-1, 0, 1]) {
  for (const j of [-1, 0, 1]) {
    if (i === 0 && j === 0) continue;
    rules.push({
      pattern: [[i, j]],
      actions: [
        {
          type: "text",
          name: "Search",
        },
        {
          type: "link",
          name: "Open",
        },
        {
          type: "image",
          name: "Copy",
        },
      ],
    });
  }
}

export const defaultRules: RuleSerialized[] = rules;
