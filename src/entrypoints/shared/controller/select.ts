import { EventEmitter } from "@/entrypoints/shared/utils/emitter";

type Callback = (buf: Event[], e: Event) => void;

enum State {
  PASSIVE,
  PENDING,
  ACTIVE,
  ABORTED,
}

interface SelectEvents {
  register: Callback;
  start: Callback;
  update: Callback;
  end: Callback;
  abort: Callback;
}

class SelectController {
  static readonly instance = new SelectController();
  private constructor() { }

  private target = document;
  enable = () => this.target.addEventListener("mousedown", this.handleMoudeDown, true);
  disable = () => this.target.removeEventListener("mousedown", this.handleMoudeDown, true);

  private events = new EventEmitter<SelectEvents>();
  addEventListener = this.events.addEventListener.bind(this.events);
  removeEventListener = this.events.removeEventListener.bind(this.events);

  private state = State.PASSIVE;
  private buffer: Event[] = [];

  private initialize(e: Event) {
    this.buffer.push(e);
    this.events.dispatchEvent("register", this.buffer, e);
    this.state = State.PENDING;

    this.target.addEventListener("selectionchange", this.handleSelectionChange, true);
    this.target.addEventListener("mouseup", this.handleMouseUp, true);
  }

  private handleMoudeDown = (e: Event) => {
    this.initialize(e);
  }

  private handleSelectionChange = (e: Event) => {
    this.update(e);
  }

  private handleMouseUp = (e: Event) => {
    this.terminate(e);
  }

  private update(e: Event) {
    this.buffer.push(e);

    switch (this.state) {
      case State.PENDING: {
        this.events.dispatchEvent("start", this.buffer, e);
        this.state = State.ACTIVE;
        break;
      }
      case State.ACTIVE: {
        this.events.dispatchEvent("update", this.buffer, e);
        break;
      }
    }
  }

  private terminate(e: Event) {
    this.buffer.push(e);

    if (this.state === State.ACTIVE && window.getSelection()?.toString()) {
      this.events.dispatchEvent("end", this.buffer, e);
    } else {
      this.events.dispatchEvent("abort", this.buffer, e);
    }

    this.reset();
  }

  private reset() {
    this.target.removeEventListener("selectionchange", this.handleSelectionChange, true);
    this.target.removeEventListener("mouseup", this.handleMouseUp, true);

    this.buffer = [];
    this.state = State.PASSIVE;
  }
}

export const selectController = SelectController.instance;
