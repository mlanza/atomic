import * as _ from "atomic/core";

export function HandlerMiddleware(handlers, identify, fallback){
  this.handlers = handlers;
  this.identify = identify;
  this.fallback = fallback;
}

const handlerMiddleware3 = _.constructs(HandlerMiddleware);

function handlerMiddleware2(handlers, identify){
  return handlerMiddleware3(handlers, identify);
}

function handlerMiddleware1(handlers){
  return handlerMiddleware2(handlers, _.identifier);
}

function handlerMiddleware0(){
  return handlerMiddleware1({});
}

export const handlerMiddleware = _.overload(handlerMiddleware0, handlerMiddleware1, handlerMiddleware2, handlerMiddleware3);
