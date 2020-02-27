import {IFn, doto, partial, specify, overload} from "atomic/core";
import {ITransientCollection} from "../../protocols";
import {_ as v} from "param.macro";

function surrogate(f, substitute){
  return function(self, ...args){
    f.apply(null, [substitute].concat(args));
    return self;
  }
}

export function Multimethod(methods, fallback){
  this.methods = methods;
  this.fallback = fallback;
}

export function multimethod(fallback){
  const instance = new Multimethod([], fallback),
        fn = partial(IFn.invoke, instance),
        conj = surrogate(ITransientCollection.conj, instance);
  return doto(fn,
    specify(ITransientCollection, {conj}));
}