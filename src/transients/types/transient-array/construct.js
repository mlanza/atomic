import Symbol from "symbol";

export function TransientArray(arr){
  this.arr = arr;
}

TransientArray.prototype[Symbol.toStringTag] = "TransientArray";

export function transientArray(arr){
  return new TransientArray(arr);
}
