import type { Settings } from "./schema";

export const defaultSettings: Settings = {
  trace: {
    display: true,
    style: {
      strokeStyle: "#0046ffcc",
      lineGrowth: true,
      lineWidth: 10,
    },
  },
  action: {
    display: true,
    followCursor: false,
    style: {
      fontColor: "#ffffffff",
      backgroundColor: "#00000080",
      fontSize: "7vh",
      horizontalPosition: 50,
      verticalPosition: 40,
    },
  },
};
