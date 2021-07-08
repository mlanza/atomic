import * as _ from "atomic/core";
import * as mut from "atomic/transients";
import {IDispatch, IEvented} from "../../protocols.js";
import {handler} from "../router/concrete.js";

function on(self, pred, callback){
  conj(self, handler(pred, callback));
}

function handles(self, message){
  return _.detect(_.matches(?, message), self.handlers);
}

function dispatch(self, message){
  const handler = handles(self, message);
  if (!handler) {
    throw new Error("No suitable handler for message.");
  }
  return IDispatch.dispatch(handler, message);
}

function conj(self, handler){
  self.handlers = _.append(self.handlers, handler);
}

export default _.does(
  _.implement(IEvented, {on}),
  _.implement(IDispatch, {dispatch}),
  _.implement(mut.ITransientCollection, {conj}));
