export function Required(key, constraint){
  this.key = key;
  this.constraint = constraint;
}

export function required(key, constraint){
  return new Required(key, constraint || null);
}