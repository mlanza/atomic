export function Bus(state, handler){
  this.state = state;
  this.handler = handler;
}

export function bus(state, handler){
  return new Bus(state, handler);
}
