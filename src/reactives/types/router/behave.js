import {does, doto, partial, implement, specify, handler, filter, concat, IMatch, ISeqable, IAppendable} from "atomic/core";
import {ITransientCollection} from "atomic/transients";
import {IDispatch, IEvented} from '../../protocols';
import {_ as v} from "param.macro";

function on(self, pred, callback){
  conj(self, handler(pred, callback));
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

function conj(self, handler){
  self.handlers = IAppendable.append(self.handlers, handler);
}

export const behaveAsRouter = does(
  implement(IEvented, {on}),
  implement(IDispatch, {dispatch}),
  implement(IMatch, {matches}),
  implement(ITransientCollection, {conj}));