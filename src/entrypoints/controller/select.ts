import { EventEmitter } from "../utils/emitter";

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
  abort: (buf: Event[]) => void;
}

class SelectController {
  static readonly instance = new SelectController();
  private constructor() { }

  private target = document;
  enable = () => this.target.addEventListener("selectstart", this.handleSelectStart);
  disable = () => this.target.removeEventListener("selectstart", this.handleSelectStart);

  private events = new EventEmitter<SelectEvents>();
  addEventListener = this.events.addEventListener.bind(this.events);
  removeEventListener = this.events.removeEventListener.bind(this.events);

  private state = State.PASSIVE;
  private buffer: Event[] = [];
  private selectedText = () => this.target.getSelection()?.toString();

  private initialize(e: Event) {
    this.buffer.push(e);
    this.events.dispatchEvent("register", this.buffer, e);
    this.state = State.PENDING;

    this.target.addEventListener("selectionchange", this.handleSelectionChange);
    this.target.addEventListener("mouseup", this.handleMouseUp);
  }

  private handleSelectStart = (e: Event) => {
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

    if (this.state === State.ACTIVE && this.selectedText()) {
      this.events.dispatchEvent("end", this.buffer, e);
    } else {
      this.events.dispatchEvent("abort", this.buffer);
    }

    this.reset();
  }

  private reset() {
    this.target.removeEventListener("selectionchange", this.handleSelectionChange);
    this.target.removeEventListener("mouseup", this.handleMouseUp);

    this.buffer = [];
    this.state = State.PASSIVE;
  }
}

export const selectController = SelectController.instance;
