import {first} from "../../protocols/iseq/concrete";
import {overload} from "../../core";

export default function Router(fallback, handlers, receives){
  this.fallback = fallback;
  this.handlers = handlers;
  this.receives = receives;
}

function router3(fallback, handlers, receives){
  return new Router(fallback, handlers, receives);
}

function router2(fallback, handlers){
  return router3(fallback, handlers, first);
}

function router1(fallback){
  return router2(fallback, []);
}

function router0(){
  return router1(null);
}

export const router = overload(router0, router1, router2, router3);

Router.from = router;