import {implement, does, each} from "atomic/core";
import {IPublish, ISubscribe} from "../../protocols.js";

function sub(self, observer){
  self.observers.push(observer);
}

function unsub(self, observer){
  const pos = self.observers.indexOf(observer);
  pos === -1 || self.observers.splice(pos, 1);
}

function subscribed(self){
  return self.observers.length;
}

function pub(self, message){
  each(IPublish.pub(?, message), self.observers);
}

export const behaveAsBroadcast = does(
  implement(ISubscribe, {sub, unsub, subscribed}),
  implement(IPublish, {pub}));