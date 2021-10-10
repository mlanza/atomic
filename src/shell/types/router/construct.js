import * as _ from "atomic/core";
import Symbol from "symbol";
import {IDispatch, IHandler} from "../../protocols.js";

export function Router(handlers, fallback){
  this.handlers = handlers;
  this.fallback = fallback;
}

Router.prototype[Symbol.toStringTag] = "Router";

function router1(fallback){
  return new Router([], handler1(fallback));
}

function router0(){
  return router1(function(){
    throw new Error("No suitable handler for message.");
  });
}

export const router = _.overload(router0, router1);

function handler2(pred, callback){
  const handler = {pred, callback};
  function handles(_, message){
    return pred(message) ? handler : null;
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

export function method(pred, callback){
  return handler2(_.spread(pred), _.spread(callback));
}

export const multimethod = _.comp(_.invokable, router);
