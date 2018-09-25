import {IFn, IAppendable, IPrependable} from "../../protocols";
import {doto, partial, overload} from "../../core";
import {specify} from "../../types/protocol";
import {_ as v} from "param.macro";

function surrogate(f, substitute){
  return function(self, ...args){
    f.apply(null, [substitute].concat(args));
    return self;
  }
}

export default function Multimethod(methods, fallback){
  this.methods = methods;
  this.fallback = fallback;
}

export function multimethod(fallback){
  const instance = new Multimethod([], fallback),
        fn = partial(IFn.invoke, instance),
        append = surrogate(IAppendable.append, instance),
        prepend = surrogate(IPrependable.prepend, instance);
  return doto(fn,
    specify(IPrependable, {prepend}),
    specify(IAppendable, {append}));
}