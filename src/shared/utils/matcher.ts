import type { Rule } from "@/shared/models/rule";
import { vectorDirectionDifference } from "./common";
import type { Vector } from "./type";

export type MatchingAlgorithm = "Strict" | "ShapeIndependent" | "Combined";

const maxDeviation: number = 0.15;
const algorithm: MatchingAlgorithm = "Combined";

export function getRuleByPattern(pattern: Vector[], rules: Rule[]) {
  let bestRule: Rule | undefined;
  let bestScore =
    algorithm === "Strict" || algorithm === "ShapeIndependent"
      ? maxDeviation
      : Infinity;

  const getScore = (r: Rule): number | undefined => {
    switch (algorithm) {
      case "Strict": {
        return patternSimilarityByProportion(pattern, r.pattern);
      }

      case "ShapeIndependent": {
        return patternSimilarityByDTW(pattern, r.pattern);
      }

      default: {
        const dtw = patternSimilarityByDTW(pattern, r.pattern);
        if (dtw > maxDeviation) return;
        return dtw + patternSimilarityByProportion(pattern, r.pattern);
      }
    }
  };

  for (const r of rules) {
    const score = getScore(r);
    if (score == null || score >= bestScore) continue;

    bestScore = score;
    bestRule = r;
  }

  return bestRule;
}

function patternSimilarityByProportion(
  patternA: Vector[],
  patternB: Vector[],
): number {
  const totalAMagnitude = patternMagnitude(patternA);
  const totalBMagnitude = patternMagnitude(patternB);

  let totalDifference = 0;

  let a = 0,
    b = 0;

  let vectorAMagnitudeProportionStart = 0;
  let vectorBMagnitudeProportionStart = 0;

  while (a < patternA.length && b < patternB.length) {
    const vectorA = patternA[a];
    const vectorB = patternB[b];

    const vectorAMagnitude = Math.hypot(...vectorA);
    const vectorBMagnitude = Math.hypot(...vectorB);

    const vectorAMagnitudeProportion = vectorAMagnitude / totalAMagnitude;
    const vectorBMagnitudeProportion = vectorBMagnitude / totalBMagnitude;

    const vectorAMagnitudeProportionEnd =
      vectorAMagnitudeProportionStart + vectorAMagnitudeProportion;
    const vectorBMagnitudeProportionEnd =
      vectorBMagnitudeProportionStart + vectorBMagnitudeProportion;

    const overlappingMagnitudeProportion = overlapProportion(
      vectorAMagnitudeProportionStart,
      vectorAMagnitudeProportionEnd,
      vectorBMagnitudeProportionStart,
      vectorBMagnitudeProportionEnd,
    );

    if (vectorAMagnitudeProportionEnd > vectorBMagnitudeProportionEnd) {
      b++;
      vectorBMagnitudeProportionStart = vectorBMagnitudeProportionEnd;
    } else if (vectorAMagnitudeProportionEnd < vectorBMagnitudeProportionEnd) {
      a++;
      vectorAMagnitudeProportionStart = vectorAMagnitudeProportionEnd;
    } else {
      a++;
      b++;
      vectorAMagnitudeProportionStart = vectorAMagnitudeProportionEnd;
      vectorBMagnitudeProportionStart = vectorBMagnitudeProportionEnd;
    }

    const vectorDifference = Math.abs(
      vectorDirectionDifference(vectorA, vectorB),
    );
    totalDifference += vectorDifference * overlappingMagnitudeProportion;
  }

  return totalDifference;
}

function patternSimilarityByDTW(
  patternA: Vector[],
  patternB: Vector[],
): number {
  const rows = patternA.length;
  const columns = patternB.length;

  const DTW: number[][] = Array.from(Array(rows), () =>
    Array(columns).fill(Infinity),
  );

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const cost = Math.abs(
        vectorDirectionDifference(patternA[i], patternB[j]),
      );

      if (i !== 0 && j !== 0) {
        DTW[i][j] =
          cost + Math.min(DTW[i - 1][j], DTW[i][j - 1], DTW[i - 1][j - 1]);
      } else if (i !== 0) {
        DTW[i][j] = cost + DTW[i - 1][j];
      } else if (j !== 0) {
        DTW[i][j] = cost + DTW[i][j - 1];
      } else {
        DTW[i][j] = cost;
      }
    }
  }

  return DTW[rows - 1][columns - 1] / Math.max(rows, columns);
}

function overlapProportion(
  minA: number,
  maxA: number,
  minB: number,
  maxB: number,
): number {
  return Math.max(0, Math.min(maxA, maxB) - Math.max(minA, minB));
}

function patternMagnitude(pattern: Vector[]): number {
  return pattern.reduce((total, vector) => total + Math.hypot(...vector), 0);
}
