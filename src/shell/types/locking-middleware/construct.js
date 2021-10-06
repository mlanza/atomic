import Symbol from "symbol";

export function LockingMiddleware(bus, queued, handling){
  this.bus = bus;
  this.queued = queued;
  this.handling = handling;
}

LockingMiddleware.prototype[Symbol.toStringTag] = "LockingMiddleware";

export function lockingMiddleware(bus){
  return new LockingMiddleware(bus, [], false);
}
