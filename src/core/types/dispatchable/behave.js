import {does, doto} from "../../core";
import {implement, specify} from '../protocol';
import {detect} from "../lazy-seq/concrete";
import {IMatch, IDispatch, IAppendable, IPrependable, IEvented} from '../../protocols';
import {_ as v} from "param.macro";

function on(self, pred, callback){
  function matches(self, message){
    return pred(message);
  }
  return append(self,
    doto(function(...args){
      return callback(...args);
    },
      specify(IMatch, {matches})));
}

function dispatch(self, message){
  const receiver = matches(self, message);
  if (receiver) {
    return IDispatch.dispatch(receiver, message);
  } else {
    throw new Error("No receiver for message.");
  }
}

function matches(self, message){
  return detect(IMatch.matches(v, message), self.handlers) || self.fallback;
}

function append(self, handler){
  return self.constructor.from(self.fallback, IAppendable.append(self.handlers, handler));
}

function prepend(self, handler){
  return self.constructor.from(self.fallback, IPrependable.prepend(self.handlers, handler));
}

export default does(
  implement(IEvented, {on}),
  implement(IDispatch, {dispatch}),
  implement(IMatch, {matches}),
  implement(IPrependable, {prepend}),
  implement(IAppendable, {append}));