import {invokable} from "../../protocols/ifn/concrete.js";

export function Multimethod(dispatch, methods, fallback){
  this.dispatch = dispatch;
  this.methods = methods;
  this.fallback = fallback;
}

export function multimethod(dispatch, fallback){
  return invokable(new Multimethod(dispatch, {}, fallback));
}
