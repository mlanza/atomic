import {does, implement} from 'atomic/core';
import {ISubscribe} from "../../protocols";

function sub(self, observer){
  ISubscribe.sub(self.source, observer);
}

function unsub(self, observer){
  ISubscribe.unsub(self.source, observer);
}

function subscribed(self){
  return ISubscribe.subscribed(self.source);
}

export const behaveAsReadonly = does(
  implement(ISubscribe, {sub, unsub, subscribed}));