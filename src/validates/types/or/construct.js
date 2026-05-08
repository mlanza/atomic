export function Or(constraints){
  this.constraints = constraints;
}

export function or(...constraints){
  return new Or(constraints);
}

Or.prototype[Symbol.toStringTag] = "Or";
