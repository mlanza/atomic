import {implement} from '../protocol';
import {effect, noop} from '../../core';
import {ISubscribe, IDisposable, ICounted, IDeref} from '../../protocols';

function sub(self, callback){
  const activated = subscribed(self) === 0;
  activated && self.activate(self.sink);
  ISubscribe.sub(self.sink, callback);
}

function unsub(self, callback){
  ISubscribe.unsub(self.sink, callback);
  const deactivated = subscribed(self) === 0;
  deactivated && self.deactivate(self.sink);
}

function subscribed(self){
  return ISubscribe.subscribed(self.sink);
}

function dispose(self){
  self.deactivate(self.sink);
}

function deref(self){
  const activated = subscribed(self) === 0;
  activated && sub(self, noop) && unsub(self, noop); //force state update
  return IDeref.deref(self.sink);
}

export default effect(
  implement(IDeref, {deref}),
  implement(IDisposable, {dispose}),
  implement(ISubscribe, {sub, unsub, subscribed}));