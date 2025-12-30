import { EventEmitter } from "../utils/emitter";
import { isEditableOrDraggable } from "../utils/others";

type Callback = (buf: DragEvent[], e: DragEvent) => void;

interface DragEvents {
  register: Callback;
  start: Callback;
  update: Callback;
  end: Callback;
  abort: (buf: DragEvent[]) => void;
};

enum State {
  PASSIVE,
  PENDING,
  ACTIVE,
  ABORTED,
}

class DragController {
  static readonly instance = new DragController();
  private constructor() { }

  private target = document;
  enable = () => this.target.addEventListener("dragstart", this.handleDragStart);
  disable = () => this.target.removeEventListener("dragstart", this.handleDragStart);

  private events = new EventEmitter<DragEvents>();
  addEventListener = this.events.addEventListener.bind(this.events);
  removeEventListener = this.events.removeEventListener.bind(this.events);

  private state = State.PASSIVE;
  private buffer: DragEvent[] = [];
  private endElement: Element | null = null;
  private moveElement: Element | null = null;

  private initialize(e: DragEvent) {
    // cache composedPath at dragstart because it becomes unreliable later.
    // override e.composedPath() so we can always get the original event path.
    const savePath = e.composedPath();
    e.composedPath = () => savePath;
    this.buffer.push(e);
    this.events.dispatchEvent("register", this.buffer, e);
    this.state = State.PENDING;

    this.target.addEventListener("dragover", this.handleDragOver, true);
    this.target.addEventListener("dragend", this.handleDragEnd, true);
    this.target.addEventListener("drop", this.handleDrop, true);
    this.target.addEventListener("dragleave", this.handleDragLeave, true);
    this.target.addEventListener("visibilitychange", this.handleVisibilityChange, true);
  }

  private handleDragStart = (e: DragEvent) => {
    this.initialize(e);
  }

  private handleDragOver = (e: DragEvent) => {
    this.update(e);
  }

  private handleDragEnd = (e: DragEvent) => {
    this.endElement = this.target.elementFromPoint(e.clientX, e.clientY);
    this.terminate(e);
  }

  private handleDrop = (e: DragEvent) => {
    this.endElement = e.target as Element;
    this.terminate(e);
  }

  private handleDragLeave = (e: DragEvent) => {
    if (e.clientX <= 0 || e.clientY <= 0 ||
      e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
      this.abort();
    }
  }

  private handleVisibilityChange = () => {
    this.abort();
    this.terminate();
  }

  private update(e: DragEvent) {
    this.buffer.push(e);

    switch (this.state) {
      case State.PENDING: {
        this.events.dispatchEvent("start", this.buffer, e);
        this.state = State.ACTIVE;
        break;
      }
      case State.ACTIVE: {
        this.events.dispatchEvent("update", this.buffer, e);
        this.moveElement = e.composedPath()[0] as Element;

        // during dragover, we can detect that the cursor
        // is over an element that should be ignore
        if (this.shouldIgnore(e)) {
          return;
        }

        this.preventDefault(e);
        break;
      }
    }
  }

  private terminate(e?: DragEvent) {
    // end will be called when drop already called terminate
    if (this.state === State.PASSIVE) return;

    if (e) this.buffer.push(e);

    if (isEditableOrDraggable(this.endElement)
      || isEditableOrDraggable(this.moveElement)) this.abort();

    if (e && this.state === State.ACTIVE) {
      this.events.dispatchEvent("end", this.buffer, e);
    } else if (this.state === State.ABORTED) {
      this.events.dispatchEvent("abort", this.buffer);
    }

    this.reset();
  }

  private abort() {
    this.state = State.ABORTED;
  }

  private reset() {
    this.target.removeEventListener("dragover", this.handleDragOver, true);
    this.target.removeEventListener("dragend", this.handleDragEnd, true);
    this.target.removeEventListener("drop", this.handleDrop, true);
    this.target.removeEventListener("dragleave", this.handleDragLeave, true);
    this.target.removeEventListener("visibilitychange", this.handleVisibilityChange, true);

    this.state = State.PASSIVE;
    this.buffer = [];
    this.endElement = null;
    this.moveElement = null;
  }

  private preventDefault(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  private shouldIgnore(e: DragEvent) {
    const el1 = e.composedPath()[0] as Element | null;
    const el2 = this.target.elementFromPoint(e.clientX, e.clientY);
    return isEditableOrDraggable(el1) || isEditableOrDraggable(el2);
  }
}

export const dragController = DragController.instance;
