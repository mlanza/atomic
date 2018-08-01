import {effect, overload, constantly, identity} from '../../core';
import {implement, forwardTo} from '../protocol';
import {IDispatch, ISubscribe, IMiddleware, ILookup, ISwap, IReset, IDeref, IDisposable, IConfigured} from '../../protocols';

function dispatch(self, command){
  IMiddleware.handle(self.handler, command);
}

function dispose(self){
  satisfies(IDisposable, self.state) && IDisposable.dispose(self.state);
  satisfies(IDisposable, self.handler) && IDisposable.dispose(self.handler);
}

function config(self){
  return self.config;
}

const forward = forwardTo("state");
const sub = forward(ISubscribe.sub);
const unsub = forward(ISubscribe.unsub);
const deref = forward(IDeref.deref);
const reset = forward(IReset.reset);
const swap = forward(ISwap.swap);

export default effect(
  implement(IDeref, {deref}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}),
  implement(IConfigured, {config}),
  implement(ISubscribe, {sub, unsub}),
  implement(IDispatch, {dispatch}),
  implement(IDisposable, {dispose}));