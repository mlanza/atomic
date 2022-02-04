import {noop} from "../../core.js";

export function Router(handlers, fallback, f){
  this.handlers = handlers;
  this.fallback = fallback;
  this.f = f;
}

Router.prototype[Symbol.toStringTag] = "Router";

export function router(handler){
  const h = handler || noop;
  return new Router([], h, h);
}
