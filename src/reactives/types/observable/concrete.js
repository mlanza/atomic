import {specify, doto} from 'cloe/core';
import {ISubscribe} from "../../protocols/isubscribe/instance";

function sub(self, callback){
  ISubscribe.sub(self.publisher, callback);
}

export function unprimed(self){
  return doto(self,
    specify(ISubscribe, {sub}));
}