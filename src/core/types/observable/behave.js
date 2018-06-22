import {implement} from '../protocol';
import {effect} from '../../core';
import {IPublish, ISubscribe, IReset, ISwap, IDeref, IDisposable, isDisposable} from '../../protocols';

function deref(self){
  return self.state;
}

function reset(self, value){
  if (value !== self.state){
    if (!self.validate || self.validate(value)) {
      self.state = value;
      IPublish.pub(self.publisher, value);
    } else {
      throw new Error("Observable update failed - invalid value.");
    }
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

function dispose(self){
  isDisposable(self.publisher) && IDisposable.dispose(self.publisher);
}

export default effect(
  implement(IDisposable, {dispose}),
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub}),
  implement(IPublish, {pub: reset}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}));