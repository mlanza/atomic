export function TransientObject(obj){
  this.obj = obj;
}

TransientObject.prototype[Symbol.toStringTag] = "TransientObject";

export function transientObject(obj){
  return new TransientObject(obj);
}
