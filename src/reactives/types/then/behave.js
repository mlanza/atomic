import {does, implement, IFunctor} from 'cloe/core';
import {ISubscribe} from "../../protocols"
import {_ as v} from "param.macro";

function sub(self, callback){
  const cb = IFunctor.fmap(v, callback);
  self.callbacks.set(callback, cb);
  ISubscribe.sub(self.source, cb);
}

function unsub(self, callback){
  const cb = self.callbacks.get(callback);
  ISubscribe.unsub(self.source, cb);
  cb && self.callbacks.delete(callback);
}

function subscribed(self){
  return ICounted.count(self.callbacks);
}

export default does(
  implement(ISubscribe, {sub, unsub, subscribed}));