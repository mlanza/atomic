import * as _ from "atomic/core";
import {ITransientCollection} from "../../protocols.js";

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
        fn = _.partial(_.invoke, instance),
        conj = surrogate(ITransientCollection.conj, instance);
  return _.doto(fn,
    _.specify(ITransientCollection, {conj}));
}
