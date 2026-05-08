export function Map(f, constraint){
  this.f = f;
  this.constraint = constraint;
}

export function map(f, constraint){
  return new Map(f, constraint);
}

Map.prototype[Symbol.toStringTag] = "Map";
