import * as _ from "atomic/core";
import {IDispatch} from "../../protocols.js";

function handler3(pred, callback, how){
  return handler2(how(pred, ?), how(callback, ?));
}

function handler2(pred, callback){
  function matches(x, message){
    return pred(message);
  }
  function dispatch(x, message){
    return callback(message);
  }
  return _.doto({pred, callback},
    _.specify(_.IMatchable, {matches}),
    _.specify(IDispatch, {dispatch}));
}

function handler1(callback){
  return handler2(_.constantly(true), callback);
}

export const handler = _.overload(null, handler1, handler2, handler3);
