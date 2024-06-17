import * as _ from "atomic/core";
import * as p from "../../protocols/concrete.js";
import {IDispatch, IMiddleware} from "../../protocols.js";

function addMiddleware(self, middleware){
  p.conj(self.middlewares, middleware);
}

function handle(self, message, next){
  const f = _.reduce(function(memo, middleware){
    return p.handle(middleware, ?, memo);
  }, next || _.noop, _.reverse(self.middlewares));
  f(message);
}

function dispatch(self, message){
  handle(self, message);
}

export default _.does(
  _.keying("Bus"),
  _.implement(IDispatch, {dispatch}),
  _.implement(IMiddleware, {handle, addMiddleware}));
