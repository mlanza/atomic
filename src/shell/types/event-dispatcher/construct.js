export function EventDispatcher(events, bus, observer){
  this.events = events;
  this.bus = bus;
  this.observer = observer;
}

export function eventDispatcher(events, bus, observer){
  return new EventDispatcher(events, bus, observer);
}