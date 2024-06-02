import {invoke} from "../../protocols/ifn/concrete.js";
import {partial} from "../../core.js";

export function Multimethod(dispatch, methods, fallback){
  this.dispatch = dispatch;
  this.methods = methods;
  this.fallback = fallback;
}

export function multimethod(dispatch, fallback){
  const behavior = new Multimethod(dispatch, {}, fallback);
  const fn = partial(invoke, behavior); //package as function
  fn.behavior = behavior;
  return fn;
}
