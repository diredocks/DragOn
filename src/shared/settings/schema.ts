export interface Trace {
  display: boolean;
  style: {
    strokeStyle: string;
    lineWidth: number;
    lineGrowth: boolean;
  };
}

export interface Action {
  display: boolean;
  followCursor: boolean;
  style: {
    fontColor: string;
    backgroundColor: string;
    fontSize: string;
    horizontalPosition: number;
    verticalPosition: number;
  };
}

export interface Settings {
  trace: Trace;
  action: Action;
}
