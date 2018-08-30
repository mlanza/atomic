import {does, doto, partial} from "../../core";
import {implement, specify} from '../protocol';
import {handler} from "./concrete";
import {filter} from "../lazy-seq/concrete";
import {concat} from "../concatenated/construct";
import {IMatch, IDispatch, IAppendable, IPrependable, IEvented, ISeqable} from '../../protocols';
import {_ as v} from "param.macro";

function on(self, pred, callback){
  return append(self, handler(pred, callback));
}

function dispatch(self, message){
  const receiver = self.receives(matches(self, message));
  if (!receiver) {
    throw new Error("No receiver for message.");
  }
  return IDispatch.dispatch(receiver, message);
}

function matches(self, message){
  const xs = filter(IMatch.matches(v, message), self.handlers);
  return ISeqable.seq(xs) ? xs : self.fallback ? [self.fallback] : [];
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