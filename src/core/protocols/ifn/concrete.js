import {constantly, partial, doto} from "../../core.js";
import {specify} from "../../types/protocol/concrete.js";
import {IFn} from "./instance.js";
import {IMutable} from "../imutable/instance.js";
import {IDeref} from "../ideref/instance.js";
export const invoke = IFn.invoke;

export function invokable(obj){
  function _invoke(self, ...args){
    return invoke(obj, ...args);
  }
  function mutate(self, effect){
    effect(obj);
    return obj;
  }
  const deref = constantly(obj);
  return doto(partial(invoke, obj),
    specify(IMutable, {mutate}),
    specify(IFn, {invoke: _invoke}),
    specify(IDeref, {deref}));
}
