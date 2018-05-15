import {implement} from '../../protocol';
import {effect} from '../../core';
import {IPublish, ISubscribe} from '../../protocols';

function sub(self, callback){
  let unsub = ISubscribe.sub(self.decorated, callback);
  let activated = self.count === 0;
  self.count += 1;
  activated && self.updated(true);
  return function(){
    if (unsub){
      let deactivated = self.count === 1;
      unsub();
      self.count -= 1;
      unsub = null;
      deactivated && self.updated(false)
    }
  }
}

function pub(self, message){
  IPublish.pub(self.decorated, message);
}

export default effect(
  implement(ISubscribe, {sub: sub}),
  implement(IPublish, {pub: pub}));