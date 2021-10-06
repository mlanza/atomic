import Symbol from "symbol";

export function Method(pred, f){
  this.pred = pred;
  this.f = f;
}

Method.prototype[Symbol.toStringTag] = "Method";

export function method(pred, f){
  return new Method(pred, f);
}
