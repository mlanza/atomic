import {does, doto, partial, implement, filter, concat, IMatchable, ISeqable, IAppendable} from "atomic/core";
import {ITransientCollection} from "atomic/transients";
import {IDispatch, IEvented} from "../../protocols.js";
import {handler} from "../router/concrete.js";

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
  const xs = filter(IMatchable.matches(?, message), self.handlers);
  return ISeqable.seq(xs) ? xs : self.fallback ? [self.fallback] : [];
}

function conj(self, handler){
  self.handlers = IAppendable.append(self.handlers, handler);
}

export const behaveAsRouter = does(
  implement(IEvented, {on}),
  implement(IDispatch, {dispatch}),
  implement(IMatchable, {matches}),
  implement(ITransientCollection, {conj}));