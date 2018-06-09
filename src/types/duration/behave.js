import {implement} from '../protocol';
import {effect, overload} from '../../core';
import {ISteppable, IAssociative, ISerialize, IDeref} from '../../protocols';

function deref(self){
  return self.milliseconds;
}

function step(self, dt){
  return new Date(dt.valueOf() + self.milliseconds);
}

function serialize1(self){
  return serialize2(self, "@type");
}

function serialize2(self, key){
  return ISerialize.serialize(IAssociative.assoc({data: Object.assign({}, self)}, key, self[Symbol.toStringTag]), key);
}

export const serialize = overload(null, serialize1, serialize2);

export default effect(
  implement(IDeref, {deref}),
  implement(ISerialize, {serialize}),
  implement(ISteppable, {step}));