export default function EventDispatcher(events, bus, publisher){
  this.events = events;
  this.bus = bus;
  this.publisher = publisher;
}

export function eventDispatcher(events, bus, publisher){
  return new EventDispatcher(events, bus, publisher);
}