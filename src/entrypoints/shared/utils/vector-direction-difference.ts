import { Vector } from "./type";

export function vectorDirectionDifference(V1: Vector, V2: Vector): number {
  let angleDifference =
    Math.atan2(V1[0], V1[1]) - Math.atan2(V2[0], V2[1]);

  if (angleDifference > Math.PI) {
    angleDifference -= 2 * Math.PI;
  } else if (angleDifference <= -Math.PI) {
    angleDifference += 2 * Math.PI;
  }

  return angleDifference / Math.PI;
}
