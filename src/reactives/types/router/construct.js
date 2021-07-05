import * as _ from "atomic/core";

export function Router(fallback, handlers, receives){
  this.fallback = fallback;
  this.handlers = handlers;
  this.receives = receives;
}

function router3(fallback, handlers, receives){
  return new Router(fallback, handlers, receives);
}

function router2(fallback, handlers){
  return router3(fallback, handlers, _.first);
}

function router1(fallback){
  return router2(fallback, []);
}

function router0(){
  return router1(null);
}

export const router = _.overload(router0, router1, router2, router3);

Router.from = router;
