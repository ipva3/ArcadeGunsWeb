type EventCallbackData<Schema, Event extends keyof Schema> = Schema[Event] extends undefined
  ? []
  : [data: Schema[Event]];

type EventCallback<Schema, Event extends keyof Schema> = (...data: EventCallbackData<Schema, Event>) => void;

type EventCallbackMap<Schema extends Record<string, any>> = {
  [Event in keyof Schema]?: Set<EventCallback<Schema, Event>>;
};

export abstract class EventEmitter<EventSchema extends Record<string, any> = Record<string, undefined>> {
  private listeners: EventCallbackMap<EventSchema> = {};

  public addEventListener<Event extends keyof EventSchema>(
    event: Event,
    callback: EventCallback<EventSchema, Event>,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set();
    }
    this.listeners[event].add(callback);
  }

  public removeEventListener<Event extends keyof EventSchema>(
    event: Event,
    callback: EventCallback<EventSchema, Event>,
  ): void {
    const callbacks = this.listeners[event];
    if (!callbacks) return;
    callbacks.delete(callback);

    if (callbacks.size === 0) {
      delete this.listeners[event];
    }
  }

  protected emit<Event extends keyof EventSchema>(event: Event, ...data: EventCallbackData<EventSchema, Event>): void {
    const callbacks = this.listeners[event];
    if (!callbacks) return;
    callbacks.forEach((callback) => {
      callback(...data);
    });
  }
}
