import {constantly, partial, doto} from "../../core.js";
import {specify} from "../../types/protocol/concrete.js";
import {IFn} from "./instance.js";
import {IDeref} from "../ideref/instance.js";
import {ISwap} from "../iswap/instance.js";
export const invoke = IFn.invoke;

export function invokable(obj){
  let state = obj;
  function invoke(self, ...args){
    return IFn.invoke(state, ...args);
  }
  function swap(self, f){
    state = f(state);
  }
  function deref(self){
    return state;
  }
  return doto(partial(invoke, null),
    specify(IFn, {invoke}),
    specify(ISwap, {swap}),
    specify(IDeref, {deref}));
}
