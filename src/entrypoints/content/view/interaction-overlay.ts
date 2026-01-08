import { getDistance } from "@/entrypoints/shared/utils/common";
import { Point } from "@/entrypoints/shared/utils/type";

export class Interaction {
  static readonly instance = new Interaction();

  private host = document.createElement("div");
  private shadow: ShadowRoot;

  private overlay = document.createElement("div");
  private canvas = document.createElement("canvas");
  private action = document.createElement("div");
  private context: CanvasRenderingContext2D;

  private traceLineWidth = 10;
  private traceLineGrowth = true;
  private actionFollowCursor = false;

  private lastTraceWidth = 0;
  private lastPoint: Point = [0, 0];

  private constructor() {
    this.host.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
    `;

    this.shadow = this.host.attachShadow({ mode: "open" });

    const reset = document.createElement("style");
    reset.textContent = `
      :host * {
        all: initial;
      }

      :host style {
        display: none;
      }
    `;
    this.shadow.appendChild(reset);

    this.overlay.popover = "manual";
    this.overlay.style.cssText = `
      position: fixed;
      inset: 0;
      pointer-events: none;
    `;
    this.shadow.appendChild(this.overlay);

    this.canvas.style.cssText = `
      pointer-events: none;
    `;
    this.context = this.canvas.getContext("2d")!;

    this.action.style.cssText = `
      --horizontalPosition: 0;
      --verticalPosition: 0;
      position: absolute;
      top: calc(var(--verticalPosition) * 1%);
      left: calc(var(--horizontalPosition) * 1%);
      transform: translate(
        calc(var(--horizontalPosition) * -1%),
        calc(var(--verticalPosition) * -1%)
      );
      font-family: "NunitoSans Regular", "Arial", sans-serif;
      line-height: normal;
      font-weight: bold;
      text-align: center;
      text-shadow: 0.01em 0.01em 0.01em rgba(0,0,0,0.5);
      padding: 0.4em 0.4em 0.3em;
      background-color: transparent;
      width: max-content;
      max-width: 50vw;
      pointer-events: none;
    `;

    window.addEventListener("resize", this.maximizeCanvas, true);
    this.maximizeCanvas();
  }

  initialize(point: Point) {
    if (
      !document.body &&
      document.documentElement.namespaceURI !== "http://www.w3.org/1999/xhtml"
    )
      return;

    if (!this.host.isConnected) {
      document.body.appendChild(this.host);
    }

    this.overlay.showPopover();
    this.lastPoint = point;
  }

  terminate() {
    this.overlay.hidePopover();
    this.host.remove();

    this.canvas.remove();
    this.action.remove();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.lastTraceWidth = 0;
    this.action.textContent = "";
  }

  updateTrace(point: Point) {
    if (!this.overlay.contains(this.canvas)) {
      this.overlay.appendChild(this.canvas);
    }

    const path = new Path2D();

    let startWidth = this.traceLineWidth;
    let endWidth = this.traceLineWidth;

    if (this.traceLineGrowth && this.lastTraceWidth < this.traceLineWidth) {
      const growthDistance = this.traceLineWidth * 50;
      const distance = getDistance(this.lastPoint, point);
      endWidth = Math.min(
        this.lastTraceWidth +
        (distance / growthDistance) * this.traceLineWidth,
        this.traceLineWidth,
      );
      startWidth = this.lastTraceWidth;
      this.lastTraceWidth = endWidth;
    }

    path.addPath(
      this.createGrowingLine(
        this.lastPoint,
        point,
        startWidth,
        endWidth
      )
    );

    this.lastPoint = { ...point };

    this.context.fill(path);
  }

  updateAction(text: string | null) {
    if (text === null || !this.overlay.isConnected) {
      this.action.remove();
      return;
    }

    this.action.textContent = text;
    if (!this.overlay.contains(this.action)) {
      this.overlay.appendChild(this.action);
    }
    if (this.actionFollowCursor) {
      this.action.style.setProperty(
        "--horizontalPosition",
        String((this.lastPoint[0] / window.innerWidth) * 100),
      );
      this.action.style.setProperty(
        "--verticalPosition",
        String((this.lastPoint[1] / window.innerHeight) * 100),
      );
    }
  }

  private maximizeCanvas = () => {
    const { lineCap, lineJoin, fillStyle, strokeStyle, lineWidth } = this.context;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    Object.assign(this.context, {
      lineCap,
      lineJoin,
      fillStyle,
      strokeStyle,
      lineWidth,
    });
  };

  private createGrowingLine(
    a: Point,
    b: Point,
    startWidth: number,
    endWidth: number,
  ): Path2D {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const angle = Math.atan2(dy, dx) + Math.PI / 2;

    const path = new Path2D();
    path.arc(a[0], a[1], startWidth / 2, angle, angle + Math.PI);
    path.arc(b[0], b[1], endWidth / 2, angle + Math.PI, angle);
    path.closePath();
    return path;
  }

  get gestureTraceLineColor(): string {
    const rgbHex = this.context.fillStyle as string;
    const alpha =
      parseFloat(this.canvas.style.getPropertyValue("opacity")) || 1;
    let aHex = Math.round(alpha * 255).toString(16);
    if (aHex.length === 1) aHex = "0" + aHex;
    return rgbHex + aHex;
  }

  set gestureTraceLineColor(value: string) {
    const rgbHex = value.substring(0, 7);
    const aHex = value.slice(7);
    const alpha = parseInt(aHex, 16) / 255;
    this.context.fillStyle = rgbHex;
    this.canvas.style.setProperty("opacity", String(alpha));
  }
}

export const interactionOverlay = Interaction.instance;
interactionOverlay.gestureTraceLineColor = "#0046ffcc";
