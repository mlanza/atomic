import * as _ from "atomic/core";
import Symbol from "symbol";

export function Router(handlers){
  this.handlers = handlers;
}

Router.prototype[Symbol.toStringTag] = "Router";

function router1(handlers){
  return new Router(handlers);
}

function router0(){
  return router1([]);
}

export const router = _.overload(router0, router1);
