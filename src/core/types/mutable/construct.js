import Symbol from "symbol";

export function Mutable(obj){
  this.obj = obj;
}

export function mutable(obj){
  return new Mutable(obj);
}

Mutable.prototype[Symbol.toStringTag] = "Mutable";
