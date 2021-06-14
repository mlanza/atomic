import {does, partial, implement, satisfies, IReset, ISwap, IDeref, IDisposable, IReduce, ICloneable} from 'atomic/core';
import {IPublish, ISubscribe} from "../../protocols.js";

function pub(self, value){
  if (value !== self.state){
    if (!self.validate || self.validate(value)) {
      self.state = value;
      IPublish.pub(self.observer, value);
    } else {
      throw new Error("Cell update failed - invalid value.");
    }
  }
}

function err(self, observer){
  IPublish.err(self.observer, observer);
}

function complete(self){
  IPublish.complete(self.observer);
}

function sub(self, observer){
  IPublish.pub(observer, self.state); //to prime subscriber state
  return ISubscribe.sub(self.observer, observer); //return unsubscribe fn
}

function unsub(self, observer){
  ISubscribe.unsub(self.observer, observer);
}

function subscribed(self){
  return ISubscribe.subscribed(self.observer);
}

function deref(self){
  return self.state;
}

function swap(self, f){
  pub(self, f(self.state));
}

function dispose(self){
  satisfies(IDisposable, self.observer) && IDisposable.dispose(self.observer);
}

function reduce(self, xf, init){
  return ISubscribe.sub(init, xf(self, ?));
}

export const behaveAsCell = does(
  implement(IDisposable, {dispose}),
  implement(IReduce, {reduce}),
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub, unsub, subscribed}),
  implement(IPublish, {pub, err, complete}),
  implement(IReset, {reset: pub}),
  implement(ISwap, {swap}));