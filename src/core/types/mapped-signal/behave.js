import {effect} from '../../core';
import {implement} from '../protocol';
import {ISubscribe, IDeref} from '../../protocols';

function deref(self){
  return self.f(IDeref.deref(self.source))
}

function sub(self, callback){
  let last = null;
  return ISubscribe.sub(self.source, function(value){
    self.pred(value, last) && callback(self.f(value));
    last = value;
  });
}

export default effect(
  implement(IDeref, {deref}),
  implement(ISubscribe, {sub}));