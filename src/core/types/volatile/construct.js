import Symbol from "symbol";

export function Volatile(state){
  this.state = state;
}

export function volatile(state){
  return new Volatile(state);
}

Volatile.prototype[Symbol.toStringTag] = "Volatile";
