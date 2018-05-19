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

function swap(self, f){
  return reset(self, f(self.state));
}

//The callback is called immediately to prime the subscriber state.
function sub(self, callback){
  callback(self.state);
  return ISubscribe.sub(self.publisher, callback);
}

export default effect(
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub}),
  implement(IPublish, {pub: reset}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}));