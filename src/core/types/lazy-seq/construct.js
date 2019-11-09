import {once} from '../../core';

export function LazySeq(perform){
  this.perform = perform;
}

export function lazySeq(perform){
  if (typeof perform !== "function") {
    throw new Error("Lazy Seq needs a thunk.");
  }
  return new LazySeq(once(perform));
}