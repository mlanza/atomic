import * as _ from "atomic/core";
import * as $ from "atomic/reactives";
import * as p from "../../protocols/concrete.js";
import {IMiddleware, IDispatch} from "../../protocols.js";

function dispatch(self, command){
  p.handle(self.handler, command);
}

function dispose(self){
  _.satisfies(_.IDisposable, self.state) && _.dispose(self.state);
  _.satisfies(_.IDisposable, self.handler) && _.dispose(self.handler);
}

export default _.does(
  _.naming("Bus"),
  _.forward("state", $.ISubscribe, _.IDeref, _.IReset, _.ISwap, _.IReduce),
  _.implement(IDispatch, {dispatch}),
  _.implement(_.IDisposable, {dispose}));