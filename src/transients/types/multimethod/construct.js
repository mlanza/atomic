import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {ITransientCollection} from "../../protocols.js";
import {method} from "../method/construct.js";
import Symbol from "symbol";

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

Multimethod.prototype[Symbol.toStringTag] = "Multimethod";

export function multimethod(fallback){
  const instance = new Multimethod([], fallback ? method(_.constantly(true), fallback) : null),
        fn = _.partial(_.invoke, instance),
        conj = surrogate(p.conj, instance);
  return _.doto(fn,
    _.specify(ITransientCollection, {conj}));
}
