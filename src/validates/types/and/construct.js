export function And(constraints){
  this.constraints = constraints;
}

export function and(...constraints){
  return new And(constraints);
}