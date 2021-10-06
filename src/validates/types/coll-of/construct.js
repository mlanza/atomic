import Symbol from "symbol";

export function CollOf(constraint){
  this.constraint = constraint;
}

export function collOf(constraint){
  return new CollOf(constraint);
}

CollOf.prototype[Symbol.toStringTag] = "CollOf";
