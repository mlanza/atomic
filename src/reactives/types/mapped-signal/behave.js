import {first, rest, does, constantly, implement, IDeref, ICounted} from 'cloe/core';
import {ISubscribe} from "../../protocols/isubscribe/instance";

function deref(self){
  return self.f(IDeref.deref(self.source));
}

function sub(self, callback){
  let last = null,
      emits = self.emits;
  function cb(value){
    const curr = self.f(value),
          emit = first(emits);
    emit(curr, last) && callback(curr);
    last = curr;
    emits = rest(emits);
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

export default does(
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub, unsub, subscribed}));