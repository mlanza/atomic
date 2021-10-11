import * as _ from "atomic/core";
import Symbol from "symbol";
import {IDispatch, IHandler} from "../../protocols.js";

export function Router(handlers, fallback){
  this.handlers = handlers;
  this.fallback = fallback;
}

Router.prototype[Symbol.toStringTag] = "Router";

export function router(handler){
  return new Router([], handler || null);
}

function handler2(pred, callback){
  const handler = {pred, callback};
  function handles(_, message){
    return pred(message);
  }
  function dispatch(_, message){
    return callback(message);
  }
  return _.doto(handler,
    _.specify(IHandler, {handles}),
    _.specify(IDispatch, {dispatch}));
}

function handler1(callback){
  return handler2(_.constantly(true), callback);
}

export const handler = _.overload(null, handler1, handler2);

function params3(extract, process, callback){
  return handler2(extract, _.opt(extract, process, _.spread(callback)));
}

export const params = _.overload(null, null, params3(?, _.identity, ?), params3);

//for use with multimethods
export function method(pred, callback){
  return handler2(_.spread(pred), _.spread(callback));
}

export const multimethod = _.comp(_.invokable, router);
