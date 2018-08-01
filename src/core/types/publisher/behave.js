import {implement} from '../protocol';
import {effect, once, applying} from '../../core';
import {each} from "../lazy-seq/concrete";
import {IPublish, ISubscribe} from '../../protocols';

function sub(self, callback){
  self.subscribers.push(callback);
}

function unsub(self, callback){
  const pos = self.subscribers.indexOf(callback);
  pos === -1 || self.subscribers.splice(pos, 1);
}

function pub(self, message){
  each(applying(message), self.subscribers);
}

export default effect(
  implement(ISubscribe, {sub, unsub}),
  implement(IPublish, {pub}));