export function Bus(middlewares){
  this.middlewares = middlewares;
}

Bus.prototype[Symbol.toStringTag] = "Bus";

export function bus(middlewares){
  return new Bus(middlewares || []);
}
