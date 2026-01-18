export interface Trace {
  enable: boolean;
  strokeColor: string;
  lineWidth: number;
  lineGrowth: boolean;
}

export interface Action {
  enable: boolean;
  followCursor: boolean;
  fontColor: string;
  backgroundColor: string;
  fontSize: string;
  horizontalPosition: number;
  verticalPosition: number;
}

export interface Settings {
  trace: Trace;
  action: Action;
}
