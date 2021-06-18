import {does, implement, once} from "atomic/core";
import {ISubscribe} from "../../protocols.js";

function sub(self, observer){
  ISubscribe.sub(self.source, observer);
  return once(function(){
    unsub(self, observer);
  });
}

function unsub(self, observer){
  ISubscribe.unsub(self.source, observer);
}

function subscribed(self){
  return ISubscribe.subscribed(self.source);
}

export const behaveAsReadonly = does(
  implement(ISubscribe, {sub, unsub, subscribed}));