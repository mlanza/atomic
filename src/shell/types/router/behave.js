import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as mut from "atomic/transients";
import * as p from "../../protocols/concrete.js";
import {IDispatch, IHandler} from "../../protocols.js";
import {handler} from "../router/concrete.js";
import Symbol from "symbol";

function on(self, pred, callback){
  conj(self, handler(pred, callback));
}

function handles(self, message){
  return _.detect(p.handles(?, message), self.handlers);
}

function dispatch(self, message){
  const handler = handles(self, message);
  if (!handler) {
    throw new Error("No suitable handler for message.");
  }
  return p.dispatch(handler, message);
}

function conj(self, handler){
  self.handlers = _.append(self.handlers, handler);
}

export default _.does(
  _.naming(?, Symbol("Router")),
  _.implement(IDispatch, {dispatch}),
  _.implement(IHandler, {handles}),
  _.implement($.IEvented, {on}),
  _.implement(mut.ITransientCollection, {conj}));
