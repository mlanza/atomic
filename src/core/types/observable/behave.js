import {implement, satisfies} from '../protocol';
import {does} from '../../core';
import {IPublish, ISubscribe, IReset, ISwap, IDeref, IDisposable} from '../../protocols';

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
}

function swap(self, f){
  reset(self, f(self.state));
}

function sub(self, callback){
  callback(self.state); //to prime subscriber state
  ISubscribe.sub(self.publisher, callback);
}

function unsub(self, callback){
  ISubscribe.unsub(self.publisher, callback);
}

function subscribed(self){
  return ISubscribe.subscribed(self.publisher);
}

function dispose(self){
  satisfies(IDisposable, self.publisher) && IDisposable.dispose(self.publisher);
}

export default does(
  implement(IDisposable, {dispose}),
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub, unsub, subscribed}),
  implement(IPublish, {pub: reset}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}));