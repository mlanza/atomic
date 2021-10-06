import {once} from "../../core.js";
import Symbol from "symbol";

export function LazySeq(perform){
  this.perform = perform;
}

LazySeq.prototype[Symbol.toStringTag] = "LazySeq";

export function lazySeq(perform){
  if (typeof perform !== "function") {
    throw new Error("Lazy Seq needs a thunk.");
  }
  return new LazySeq(once(perform));
}
