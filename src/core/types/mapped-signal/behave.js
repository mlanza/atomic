import {effect, constantly} from '../../core';
import {implement} from '../protocol';
import {ISubscribe, IDeref, ICounted} from '../../protocols';

function deref(self){
  return self.f(IDeref.deref(self.source))
}

function sub(self, callback){
  let last = null,
      pred = constantly(true); //force priming callback
  function cb(value){
    const curr = self.f(value);
    const changed = pred(curr, last);
    last = curr;
    pred = self.pred;
    changed && callback(curr);
  }
  self.callbacks.set(callback, cb);
  ISubscribe.sub(self.source, cb);
}

function unsub(self, callback){
  const cb = self.callbacks.get(callback);
  cb && self.callbacks.delete(callback);
  ISubscribe.unsub(self, cb);
}

function subscribed(self){
  return ICounted.count(self.callbacks);
}

export default effect(
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub, unsub, subscribed}));