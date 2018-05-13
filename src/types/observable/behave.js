import {implement} from '../../protocol';
import {effect} from '../../core';
import {IPublish, ISubscribe, IReset, ISwap, IDeref, IDisposable} from '../../protocols';

function deref(self){
  return self.state;
}

function reset(self, value){
  if (value !== self.state){
    self.state = value;
    IPublish.pub(self.publisher, value);
  }
  return self.state;
}

function _swap(self, f){
  return reset(self, f(self.state));
}

function sub(self, callback){
  callback(self.state);
  return ISubscribe.sub(self.publisher, callback);
}

export default effect(
  implement(IDeref, {deref: deref}),
  implement(ISubscribe, {sub: sub}),
  implement(IPublish, {pub: reset}),
  implement(IReset, {reset: reset}),
  implement(ISwap, {_swap: _swap}));