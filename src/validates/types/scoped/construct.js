export function Scoped(key, constraint){
  this.key = key;
  this.constraint = constraint;
}

export function scoped(key, constraint){
  return new Scoped(key, constraint);
}

Scoped.prototype[Symbol.toStringTag] = "Scoped";
