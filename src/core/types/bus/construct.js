export default function Bus(config, state, handler){
  this.config = config;
  this.state = state;
  this.handler = handler;
}

export function bus(config, state, handler){
  return new Bus(config, state, handler);
}
