export function TransientArray(arr){
  this.arr = arr;
}

export function transientArray(arr){
  return new TransientArray(arr);
}