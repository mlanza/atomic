import * as _ from "atomic/core";
import {IDispatch, IHandler} from "../../protocols.js";

function handler3(pred, callback, how){
  return handler2(how(pred, ?), how(callback, ?));
}

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

export const handler = _.overload(null, handler1, handler2, handler3);
