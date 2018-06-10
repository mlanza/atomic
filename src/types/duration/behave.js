import {implement} from '../protocol';
import {effect, overload} from '../../core';
import {ISteppable, IAssociative, IEncode, IDeref} from '../../protocols';

function deref(self){
  return self.milliseconds;
}

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

function encode(self, label, refstore, seed){
  return IAssociative.assoc({data: IEncode.encode(Object.assign({}, self), label, refstore, seed)}, label, self[Symbol.toStringTag]);
}

export default effect(
  implement(IDeref, {deref}),
  implement(IEncode, {encode}),
  implement(ISteppable, {step}));