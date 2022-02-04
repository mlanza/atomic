export function When(pred, constraint){
  this.pred = pred;
  this.constraint = constraint;
}

export function when(pred, constraint){
  return new When(pred, constraint);
}

When.prototype[Symbol.toStringTag] = "When";
