import * as p from "../../protocols";

export function Multimethod(fallback, handlers){
  this.fallback = fallback;
  this.handlers = handlers;
}

export function multimethod(fallback){
  const instance = new Multimethod(fallback, []);
  function method(...args){
    return p.invoke(instance, ...args);
  }
  method.instance = instance;
  return method;
}

export default Multimethod;