import {EMPTY} from "../types/empty";

export function IndexedSeq(arr, start){
  this.arr = arr;
  this.start = start;
}

export function indexedSeq(arr, start){
  return start < arr.length ? new IndexedSeq(arr, start) : EMPTY;
}

export {IndexedSeq as default};