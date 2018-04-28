import {implement} from '../../protocol';
import {doto} from '../../core';
import Publisher from '../../types/publisher/construct';
import IPublish from '../../protocols/ipublish';
import ISubscribe from '../../protocols/isubscribe';

function sub(self, callback){
  const id = self.seed;
  self.seed += 1;
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

doto(Publisher,
  implement(ISubscribe, {sub: sub}),
  implement(IPublish, {pub: pub}));