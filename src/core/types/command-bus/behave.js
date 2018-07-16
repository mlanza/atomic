import {effect, overload, constantly, identity} from '../../core';
import {implement} from '../protocol';
import {IDispatch, ISubscribe, IMiddleware, ILookup, ISwap, IReset, IDeref, IDisposable, IConfigured} from '../../protocols';

function dispatch(self, command){
  return IMiddleware.handle(self.handler, command);
}

function sub(self, callback){
  return ISubscribe.sub(self.state, callback);
}

function deref(self){
  return IDeref.deref(self.state);
}

function reset(self, value){
  return IReset.rest(self.state, value);
}

function swap(self, f){
  return ISwap.swap(self.state, f);
}

function dispose(self){
  satisfies(IDisposable, self.state) && IDisposable.dispose(self.state);
  satisfies(IDisposable, self.handler) && IDisposable.dispose(self.handler);
}

function config(self){
  return self.config;
}

export default effect(
  implement(IDeref, {deref}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}),
  implement(IConfigured, {config}),
  implement(ISubscribe, {sub}),
  implement(IDispatch, {dispatch}),
  implement(IDisposable, {dispose}));