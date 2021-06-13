import {implement, does, each, clone, ICounted} from "atomic/core";
import {IPublish, ISubscribe} from "../../protocols.js";

function sub(self, observer){
  self.observers.push(observer);
  return function(){
    unsub(self, observer);
  }
}

function unsub(self, observer){
  const pos = self.observers.lastIndexOf(observer);
  if (pos > -1) {
    self.observers.splice(pos, 1);
  }
}

function count(self){
  return ICounted.count(self.observers);
}

function pub(self, message){
  notify(self, IPublish.pub(?, message));
}

function err(self, error){
  notify(self, IPublish.err(?, error));
}

function complete(self){
  notify(self, IPublish.complete);
}

//copying prevents midstream changes to observers
function notify(self, f){
  each(f, clone(self.observers));
}

export const behaveAsBroadcast = does(
  implement(ICounted, {count}),
  implement(ISubscribe, {sub, unsub, subscribed: count}),
  implement(IPublish, {pub, err, complete}));