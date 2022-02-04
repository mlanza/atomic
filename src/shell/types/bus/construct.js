export function Bus(state, handler){
  this.state = state;
  this.handler = handler;
}

 Bus.prototype[Symbol.toStringTag] = "Bus";

export function bus(state, handler){
  return new Bus(state, handler);
}
