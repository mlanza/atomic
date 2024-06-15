import * as _ from "atomic/core";

export function HandlerMiddleware(handlers, identify, fallback = null){
  this.handlers = handlers;
  this.identify = identify;
  this.fallback = fallback;
}

HandlerMiddleware.prototype[Symbol.toStringTag] = "HandlerMiddleware";

const handlerMiddleware3 = _.constructs(HandlerMiddleware);

function handlerMiddleware1(identify){
  return handlerMiddleware3({}, identify);
}

function handlerMiddleware0(){
  return handlerMiddleware1(_.identifier);
}

export const handlerMiddleware = _.overload(handlerMiddleware0, handlerMiddleware1, handlerMiddleware3);
