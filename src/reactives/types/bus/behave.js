import {does, identity, implement, forwardTo, ILookup, ISwap, IReset, IDeref, IDisposable} from 'atomic/core';
import {IMiddleware, ISubscribe, IDispatch} from "../../protocols"

function dispatch(self, command){
  IMiddleware.handle(self.handler, command);
}

function dispose(self){
  satisfies(IDisposable, self.state) && IDisposable.dispose(self.state);
  satisfies(IDisposable, self.handler) && IDisposable.dispose(self.handler);
}

const forward = forwardTo("state");
const sub = forward(ISubscribe.sub);
const unsub = forward(ISubscribe.unsub);
const subscribed = forward(ISubscribe.subscribed);
const deref = forward(IDeref.deref);
const reset = forward(IReset.reset);
const swap = forward(ISwap.swap);

export default does(
  implement(IDeref, {deref}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}),
  implement(ISubscribe, {sub, unsub, subscribed}),
  implement(IDispatch, {dispatch}),
  implement(IDisposable, {dispose}));