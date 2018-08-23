import {specify} from '../protocol';
import {doto} from '../../core';
import {ISubscribe} from '../../protocols';

function sub(self, callback){
  ISubscribe.sub(self.publisher, callback);
}

export function unprimed(self){
  return doto(self,
    specify(ISubscribe, {sub}));
}
