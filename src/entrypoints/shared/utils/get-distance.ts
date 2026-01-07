import { Point } from "./type";

export function getDistance(x: Point, y: Point) {
  return Math.hypot(y[0] - x[0], y[1] - x[1]);
}
