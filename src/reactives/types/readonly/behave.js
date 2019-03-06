import {does, implement} from 'cloe/core';
import {ISubscribe} from "../../protocols";

function sub(self, callback){
  ISubscribe.sub(self.source, callback);
}

function unsub(self, callback){
  ISubscribe.unsub(self.source, callback);
}

function subscribed(self){
  return ISubscribe.subscribed(self.source);
}

export default does(
  implement(ISubscribe, {sub, unsub, subscribed}));