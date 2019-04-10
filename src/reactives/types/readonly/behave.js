import {does, implement} from 'cloe/core';
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

export default does(
  implement(ISubscribe, {sub, unsub, subscribed}));