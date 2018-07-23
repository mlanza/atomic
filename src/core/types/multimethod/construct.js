import {IFn, IEvented} from "../../protocols";
import {doto} from "../../core";
import {specify} from "../../types/protocol";

export function Multimethod(fallback, handlers){
  this.fallback = fallback;
  this.handlers = handlers;
}

export function multimethod(fallback){
  const instance = new Multimethod(fallback, []);
  function fn(...args) {
    return IFn.invoke(instance, ...args);
  }
  function on(self, pred, callback){
    return IEvented.on(instance, pred, callback);
  }
  function off(self, pred, callback){
    return IEvented.off(instance, pred, callback);
  }
  doto(fn,
    specify(IEvented, {on, off}));
  return fn;
}

export default Multimethod;