import type { Point, Vector } from "@/shared/utils/type";
import "@/entrypoints/options/styles/pattern.css";

export function getCatmullRomPathData(points: Point[], alpha = 0.5): string {
  if (points.length < 2) return "";

  let d = `M${points[0][0]},${points[0][1]} C`;
  const n = points.length - 1;

  for (let i = 0; i < n; i++) {
    const p0 = points[i - 1] ?? points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const d1 = Math.hypot(p0[0] - p1[0], p0[1] - p1[1]);
    const d2 = Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
    const d3 = Math.hypot(p2[0] - p3[0], p2[1] - p3[1]);

    const d1a = d1 ** alpha,
      d1a2 = d1a ** 2;
    const d2a = d2 ** alpha,
      d2a2 = d2a ** 2;
    const d3a = d3 ** alpha,
      d3a2 = d3a ** 2;

    const A = 2 * d1a2 + 3 * d1a * d2a + d2a2;
    const B = 2 * d3a2 + 3 * d3a * d2a + d2a2;

    const N = 1 / (3 * d1a * (d1a + d2a) || 1);
    const M = 1 / (3 * d3a * (d3a + d2a) || 1);

    let x1 = (-d2a2 * p0[0] + A * p1[0] + d1a2 * p2[0]) * N;
    let y1 = (-d2a2 * p0[1] + A * p1[1] + d1a2 * p2[1]) * N;

    let x2 = (d3a2 * p1[0] + B * p2[0] - d2a2 * p3[0]) * M;
    let y2 = (d3a2 * p1[1] + B * p2[1] - d2a2 * p3[1]) * M;

    if (!x1 && !y1) {
      x1 = p1[0];
      y1 = p1[1];
    }

    if (!x2 && !y2) {
      x2 = p2[0];
      y2 = p2[1];
    }

    d += ` ${x1},${y1},${x2},${y2},${p2[0]},${p2[1]}`;
  }

  return d;
}

export function PatternThumbnail(props: {
  pattern: Vector[];
  showAnimation: boolean;
  viewBox: number;
}) {
  const viewBoxWidth = props.viewBox;
  const viewBoxHeight = props.viewBox;

  const points = createMemo<Point[]>(() => {
    return props.pattern.reduce<Point[]>(
      (acc, [dx, dy]) => {
        const [lastX, lastY] = acc[acc.length - 1];
        acc.push([lastX + dx, lastY + dy]);
        return acc;
      },
      [[0, 0]],
    );
  });

  const d = createMemo(() => getCatmullRomPathData(points()));

  const [transform, setTransform] = createSignal("");
  const [pathStyles, setPathStyles] = createSignal<Record<string, string>>({});

  let svgRef: SVGSVGElement | undefined;
  let pathRef: SVGPathElement | undefined;

  createEffect(() => {
    const pathEl = pathRef;
    const currentD = d();

    if (!pathEl || !currentD) return;

    const bbox = pathEl.getBBox();
    if (bbox.width === 0 && bbox.height === 0) return;

    const scale =
      Math.min(viewBoxWidth / bbox.width, viewBoxHeight / bbox.height) * 0.7;
    const translateX =
      -bbox.x * scale + viewBoxWidth / 2 - (bbox.width * scale) / 2;
    const translateY =
      -bbox.y * scale + viewBoxHeight / 2 - (bbox.height * scale) / 2;

    setTransform(`translate(${translateX},${translateY}) scale(${scale})`);

    const pathLength = pathEl.getTotalLength();
    setPathStyles({
      "--pathLength": pathLength.toString(),
      "--pathScale": scale.toString(),
      "--animationDuration": `${pathLength * scale * 4}ms`,
    });
  });

  const handleMouseEnter = () => {
    if (props.showAnimation) svgRef?.classList.add("demo");
  };

  const handleMouseLeave = () => {
    if (!svgRef || !pathRef || !props.showAnimation) return;

    const isRunning = pathRef
      .getAnimations()
      .some((a) => a.playState === "running");

    if (isRunning) {
      pathRef.addEventListener(
        "animationend",
        () => svgRef?.classList.remove("demo"),
        { once: true },
      );
    } else {
      svgRef.classList.remove("demo");
    }
  };

  return (
    <>
      {/** biome-ignore lint/a11y/noSvgWithoutTitle: pass it */}
      <svg
        ref={svgRef}
        preserveAspectRatio="xMidYMid meet"
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        class="pattern-thumbnail h-full p-3.75"
        style={{ ...pathStyles() }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <g transform={transform()}>
          <path
            ref={pathRef}
            d={d()}
            class="path-trail fill-none stroke-neutral-600 transition-colors duration-300"
            style={{
              "stroke-width": "calc(5px / var(--pathScale))",
              "stroke-dasharray": "var(--pathLength)",
              "stroke-dashoffset": "0",
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
            }}
          />
          <path
            d="M0,-7 L14,0 L0,7 z"
            class="path-arrow fill-neutral-600 transition-colors duration-300"
            style={{
              "offset-path": `path('${d()}')`,
              "offset-distance": "100%",
              transform:
                "scale(calc(1 / var(--pathScale) * var(--arrowScale, 1)))",
            }}
          />
        </g>
      </svg>
    </>
  );
}
