export class EventEmitter<
  Events extends { [K in keyof Events]: (...args: any[]) => void },
> {
  private events: { [K in keyof Events]?: Set<Events[K]> } = {};

  addEventListener<K extends keyof Events>(eventName: K, callback: Events[K]) {
    if (!this.events[eventName]) {
      this.events[eventName] = new Set();
    }
    this.events[eventName].add(callback);
  }

  removeEventListener<K extends keyof Events>(
    eventName: K,
    callback: Events[K],
  ) {
    this.events[eventName]?.delete(callback);
  }

  dispatchEvent<K extends keyof Events>(
    eventName: K,
    ...args: Parameters<Events[K]>
  ) {
    this.events[eventName]?.forEach((cb) => {
      cb(...args);
    });
  }
}
