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
