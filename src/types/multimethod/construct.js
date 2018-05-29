import {IFn} from "../../protocols";

export function Multimethod(fallback, handlers){
  this.fallback = fallback;
  this.handlers = handlers;
}

export function multimethod(fallback){
  const instance = new Multimethod(fallback, []);
  function method(...args){
    return IFn.invoke(instance, ...args);
  }
  method.instance = instance;
  return method;
}

export default Multimethod;