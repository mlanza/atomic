export function LockingMiddleware(bus, queued, handling){
  this.bus = bus;
  this.queued = queued;
  this.handling = handling;
}

export function lockingMiddleware(bus){
  return new LockingMiddleware(bus, [], false);
}
