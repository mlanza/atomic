import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as mut from "atomic/transients";
import * as p from "../../protocols/concrete.js";
import {IDispatch, IHandler} from "../../protocols.js";
import {handler} from "../router/construct.js";

function on(self, pred, callback){
  conj(self, handler(pred, callback));
}

function handles(self, message){
  return _.detect(p.handles(?, message), self.handlers) || self.fallback;
}

function dispatch(self, message){
  return p.dispatch(handles(self, message), message);
}

function invoke(self, ...args){
  return dispatch(self, args);
}

function conj(self, handler){
  self.handlers = _.append(self.handlers, handler);
}

export default _.does(
  _.naming("Router"),
  _.implement(IDispatch, {dispatch}),
  _.implement(_.IFn, {invoke}),
  _.implement(IHandler, {handles}),
  _.implement($.IEvented, {on}),
  _.implement(mut.ITransientCollection, {conj}));
