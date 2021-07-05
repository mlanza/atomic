import * as _ from "atomic/core";
import * as mut from "atomic/transients";
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
  const xs = _.filter(_.matches(?, message), self.handlers);
  return _.seq(xs) ? xs : self.fallback ? [self.fallback] : [];
}

function conj(self, handler){
  self.handlers = _.append(self.handlers, handler);
}

export default _.does(
  _.implement(IEvented, {on}),
  _.implement(IDispatch, {dispatch}),
  _.implement(_.IMatchable, {matches}),
  _.implement(mut.ITransientCollection, {conj}));
