import Symbol from "symbol";

export function EventDispatcher(events, bus, observer){
  this.events = events;
  this.bus = bus;
  this.observer = observer;
}

EventDispatcher.prototype[Symbol.toStringTag] = "EventDispatcher";

export function eventDispatcher(events, bus, observer){
  return new EventDispatcher(events, bus, observer);
}
