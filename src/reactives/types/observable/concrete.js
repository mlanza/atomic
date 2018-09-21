import {specify, doto, ISubscribe} from 'cloe/core';

function sub(self, callback){
  ISubscribe.sub(self.publisher, callback);
}

export function unprimed(self){
  return doto(self,
    specify(ISubscribe, {sub}));
}
