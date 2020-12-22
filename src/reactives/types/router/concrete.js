import {doto, overload, specify, IMatchable} from "atomic/core";
import {IDispatch} from '../../protocols';

function handler3(pred, callback, how){
  return handler2(how(pred, ?), how(callback, ?));
}

function handler2(pred, callback){
  function matches(_, message){
    return pred(message);
  }
  function dispatch(_, message){
    return callback(message);
  }
  return doto({pred, callback},
    specify(IMatchable, {matches}),
    specify(IDispatch, {dispatch}));
}

export const handler = overload(null, null, handler2, handler3);