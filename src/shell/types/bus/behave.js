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
  _.keying("Bus"),
  _.forward("state", $.ISubscribe, _.IDeref, _.IResettable, _.ISwappable, _.IReducible),
  _.implement(IDispatch, {dispatch}),
  _.implement(_.IDisposable, {dispose}));
