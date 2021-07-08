import * as _ from "atomic/core";

export function Router(handlers){
  this.handlers = handlers;
}

function router1(handlers){
  return new Router(handlers);
}

function router0(){
  return router1([]);
}

export const router = _.overload(router0, router1);

Router.from = router;
