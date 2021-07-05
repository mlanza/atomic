import * as _ from "atomic/core";

export function Middleware(handlers){
  this.handlers = handlers;
}

export function middleware(handlers){
  return _.doto(new Middleware(handlers || []),
    _.apply(_.conj, ?, handlers));
}
