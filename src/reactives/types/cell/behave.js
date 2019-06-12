import {does, implement, satisfies, IReset, ISwap, IDeref, IDisposable} from 'atomic/core';
import {IPublish, ISubscribe} from "../../protocols";

function deref(self){
  return self.state;
}

function reset(self, value){
  if (value !== self.state){
    if (!self.validate || self.validate(value)) {
      self.state = value;
      IPublish.pub(self.observer, value);
    } else {
      throw new Error("Cell update failed - invalid value.");
    }
  }
}

function swap(self, f){
  reset(self, f(self.state));
}

function sub(self, observer){
  IPublish.pub(observer, self.state); //to prime subscriber state
  ISubscribe.sub(self.observer, observer);
}

function unsub(self, observer){
  ISubscribe.unsub(self.observer, observer);
}

function subscribed(self){
  return ISubscribe.subscribed(self.observer);
}

function dispose(self){
  satisfies(IDisposable, self.observer) && IDisposable.dispose(self.observer);
}

export default does(
  implement(IDisposable, {dispose}),
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub, unsub, subscribed}),
  implement(IPublish, {pub: reset}),
  implement(IReset, {reset}),
  implement(ISwap, {swap}));