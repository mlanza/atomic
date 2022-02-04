export function Indexed(obj){
  this.obj = obj;
}

Indexed.prototype[Symbol.toStringTag] = "Indexed";

export function indexed(obj){
  return new Indexed(obj);
}
