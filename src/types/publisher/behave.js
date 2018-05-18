import {implement} from '../../protocol';
import {effect} from '../../core';
import {IPublish, ISubscribe} from '../../protocols';

function sub(self, callback){
  const id = self.seed();
  self.subscribers[id] = callback;
  return function(){
    delete self.subscribers[id];
  }
}

function pub(self, message){
  Object.values(self.subscribers).forEach(function(callback){
    callback(message);
  });
}

export default effect(
  implement(ISubscribe, {sub}),
  implement(IPublish, {pub}));