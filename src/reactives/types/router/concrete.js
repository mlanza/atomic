import {doto, overload, specify, IMatch} from "atomic/core";
import {IDispatch} from '../../protocols';
import {_ as v} from "param.macro";

function handler3(pred, callback, how){
  return handler2(how(pred, v), how(callback, v));
}

function handler2(pred, callback){
  function matches(_, message){
    return pred(message);
  }
  function dispatch(_, message){
    return callback(message);
  }
  return doto({pred, callback},
    specify(IMatch, {matches}),
    specify(IDispatch, {dispatch}));
}

export const handler = overload(null, null, handler2, handler3);