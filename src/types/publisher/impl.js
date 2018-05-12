import {implement} from '../../protocol';
import {juxt} from '../../core';
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

export default juxt(
  implement(ISubscribe, {sub: sub}),
  implement(IPublish, {pub: pub}));