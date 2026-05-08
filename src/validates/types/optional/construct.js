export function Optional(key, constraint){
  this.key = key;
  this.constraint = constraint;
}

export function optional(key, constraint){
  return new Optional(key, constraint || null);
}

Optional.prototype[Symbol.toStringTag] = "Optional";
