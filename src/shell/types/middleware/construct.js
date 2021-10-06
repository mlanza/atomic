import * as _ from "atomic/core";
import Symbol from "symbol";

export function Middleware(handlers){
  this.handlers = handlers;
}

Middleware.prototype[Symbol.toStringTag] = "Middleware";

export function middleware(handlers){
  return _.doto(new Middleware(handlers || []),
    _.apply(_.conj, ?, handlers));
}
