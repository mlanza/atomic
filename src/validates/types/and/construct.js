import Symbol from "symbol";

export function And(constraints){
  this.constraints = constraints;
}

export function and(...constraints){
  return new And(constraints);
}

And.prototype[Symbol.toStringTag] = "And";
