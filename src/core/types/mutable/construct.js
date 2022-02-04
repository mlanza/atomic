export function Mutable(state){
  this.state = state;
}

export function mutable(state){
  return new Mutable(state);
}

Mutable.prototype[Symbol.toStringTag] = "Mutable";
