export function Catches(constraint){
  this.constraint = constraint;
}

export function catches(constraint){
  return new Catches(constraint);
}

Catches.prototype[Symbol.toStringTag] = "Catches";
