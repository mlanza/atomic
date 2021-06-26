import {does, identity, implement, forward, IReduce, ILookup, ISwap, IReset, IDeref, IDisposable} from "atomic/core";
import {IMiddleware, ISubscribe, IDispatch} from "../../protocols.js"

function dispatch(self, command){
  IMiddleware.handle(self.handler, command);
}

function dispose(self){
  satisfies(IDisposable, self.state) && IDisposable.dispose(self.state);
  satisfies(IDisposable, self.handler) && IDisposable.dispose(self.handler);
}

export default does(
  forward("state", ISubscribe, IDeref, IReset, ISwap, IReduce),
  implement(IDispatch, {dispatch}),
  implement(IDisposable, {dispose}));