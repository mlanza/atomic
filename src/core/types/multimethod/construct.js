import {IFn} from "../../protocols";

export function Multimethod(fallback, handlers){
  this.fallback = fallback;
  this.handlers = handlers;
}

export function multimethod(fallback){
  const instance = new Multimethod(fallback, []);
  function fn(...args) {
    return IFn.invoke(instance, ...args);
  }
  return new Proxy(fn, {
    get: function(target, prop, receiver){
      return prop === 'apply' ? fn[prop].bind(fn) : instance[prop];
    },
    set: function(target, prop, value){
      instance[prop] = value;
      return true;
    }
  });
}

export default Multimethod;