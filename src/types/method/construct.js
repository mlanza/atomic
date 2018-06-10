import {overload} from "../../core";
import {IFn} from "../../protocols/ifn";

export default function Method(hash, dispatch, handlers, fallback){
  this.dispatch = dispatch;
  this.handlers = handlers;
  this.fallback = fallback;
  this.hash = hash;
}

function method2(hash, dispatch){
  const instance = new Method(hash, dispatch, new Map());
  function fn(...args) {
    return IFn.invoke(instance, ...args);
  }
  return new Proxy(fn, {
    get: function(target, prop, receiver){
      return instance[prop];
    },
    set: function(target, prop, value){
      instance[prop] = value;
    }
  });
}

function method1(dispatch){
  return method2(Method.hash, dispatch);
}

export const method = overload(null, method1, method2);

export {Method};