import {effect, constantly} from '../../core';
import {implement} from '../protocol';
import {ISubscribe, IDeref} from '../../protocols';

function deref(self){
  return self.f(IDeref.deref(self.source))
}

function sub(self, callback){
  let last = null,
      pred = constantly(true); //force priming callback
  return ISubscribe.sub(self.source, function(value){
    const curr = self.f(value);
    if (pred(curr, last)){
      callback(curr);
    }
    last = curr;
    pred = self.pred;
  });
}

export default effect(
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub}));