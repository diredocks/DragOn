import { EventEmitter } from "../utils/emitter";

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

  private initialize(e: DragEvent) {
    this.buffer.push(e);
    this.events.dispatchEvent("register", this.buffer, e);
    this.state = State.PENDING;

    this.target.addEventListener("dragover", this.handleDragOver, true);
    this.target.addEventListener("dragend", this.handleDragEnd, true);
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
    if (this.checkIfOnInput(e)) {
      this.abort();
    }
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
        if (!this.checkIfOnInput(e)) {
          this.preventDefault(e);
        }
        break;
      }
    }
  }

  private terminate(e?: DragEvent) {
    if (e) this.buffer.push(e);

    // NOTE: dragmove and dragleave compete for the state;
    // whichever fires last determines the current state.
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
    this.target.removeEventListener("dragleave", this.handleDragLeave, true);
    this.target.removeEventListener("visibilitychange", this.handleVisibilityChange, true);

    this.buffer = [];
    this.state = State.PASSIVE;
  }

  private preventDefault(e: Event) {
    e.preventDefault();
    e.stopPropagation();
  }

  private checkIfOnInput(e: DragEvent) {
    const t1 = e.composedPath()[0] as Element;
    const t2 = this.target.elementFromPoint(e.clientX, e.clientY);
    return t1 instanceof HTMLInputElement || t1 instanceof HTMLTextAreaElement ||
      t2 instanceof HTMLInputElement || t2 instanceof HTMLTextAreaElement;
  }
}

export const dragController = DragController.instance;
