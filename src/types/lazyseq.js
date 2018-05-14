export * from "./lazyseq/construct";
import LazySeq from "./lazyseq/construct";
export default LazySeq;
import behave from "./lazyseq/behave";
import {lazySeq} from "./lazyseq/construct";
import {EMPTY} from "./empty/construct";
import {apply} from "./function";
import {constantly} from "../core";
behave(LazySeq);

export function juxts(f, ...fs){
  return arguments.length ? function(x){
    return lazySeq(f(x), function(){
      return apply(juxts, fs)(x);
    });
  } : constantly(EMPTY);
}